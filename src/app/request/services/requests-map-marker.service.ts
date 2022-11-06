import { EventEmitter, Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { delay, fromEvent, Observable, takeUntil } from 'rxjs';
import { ComponentRenderService } from 'src/app/shared/services/component-render.service';
import { LatLng } from '../models/lat-lng';
import { MarkerImageSource, MarkerLayer, MarkerLayerSource, PopupSource } from '../models/map/marker-layer';
import { RequestsMapDataService } from './requests-map-data.service';
import { RequestsMapEventService } from './requests-map-event.service';

// This is constant
// eslint-disable-next-line
const CLUSTER_RADIUSES = [ 20, 100, 30, 750, 40 ];
const POPUP_CLOSE_PERIOD = 500;
const MARKER_POPUP_OFFSET = 25;
const CLUSTER_POPUP_OFFSET = 40;

@Injectable({
  providedIn: 'root',
})
export class RequestsMapMarkerService {

  constructor(
    private readonly events: RequestsMapEventService,
    private readonly data: RequestsMapDataService,
    private readonly renderer: ComponentRenderService,
  ) { }


  // #region Init

  private map?: mapboxgl.Map;

  public init(map: mapboxgl.Map): void {
    this.map = map;
  }

  // #endregion


  // #region Storage

  private layers: MarkerLayer[] = [];

  // #endregion


  // #region Removement

  private removeLayer(layer: MarkerLayer): void {
    this.data.removeLayer(`${layer.id}-cluster-background`);
    this.data.removeLayer(`${layer.id}-cluster-count`);
    this.data.removeSource(layer.id);

    for (const marker of layer.markers.values()) {
      marker.remove();
    }

    layer.destroy$.emit();
  }

  public removeLayers(): void {
    for (const layer of this.layers) {
      this.removeLayer(layer);
    }
    this.layers = [];
  }

  // #endregion


  // #region Rendering

  private renderLayer(
    id: string,
    // eslint-disable-next-line
    idMethod: (obj: any) => string | number,
    markers: Map<string, mapboxgl.Marker>,
  ): void {
    if (!this.map) {
      throw new Error('Cannot render markers. No map provided');
    }

    // removing all markers
    for (const marker of markers.values()) {
      marker.remove();
    }

    // adding to map only markers not in clusters
    const shownMarkerIds = this.getShownMarkerIds(this.map, id, idMethod);
    for (const id of shownMarkerIds) {
      const marker = markers.get(id);
      if (!marker) { continue; }

      marker.addTo(this.map);
    }
  }

  /**
   * Returns all markers that are not inside cluster
   */
  private getShownMarkerIds(
    map: mapboxgl.Map,
    id: string,
    // eslint-disable-next-line
    idMethod: (obj: any) => string | number,
  ): string[] {
    return map.querySourceFeatures(id)
      .filter(feature => !feature.properties!['cluster'])
      .map(feature => idMethod(feature.properties).toString());
  }

  // #endregion


  // #region Addition

  public addLayer<T, MC, CC>(
    id: string,
    source: MarkerLayerSource<T, MC, CC>,
  ): void {
    this.data.addSource(id, {
      type: 'geojson',
      data: source.data,
      cluster: true,
      clusterRadius: 100,
      clusterProperties: source.cluster.properties,
    });

    this.data.addLayer({
      id: `${id}-cluster-background`,
      type: 'circle',
      source: id,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': source.cluster.background,
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          ...CLUSTER_RADIUSES,
        ],
      },
    });

    this.data.addLayer({
      id: `${id}-cluster-count`,
      type: 'symbol',
      source: id,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans SemiBold', 'Arial Unicode MS Bold'],
        'text-size': 22,
      },
      paint: {
        'text-color': source.cluster.color,
      },
    });

    if (!this.map) {
      throw new Error('Cannot add markers. Map is not defined');
    }
    if (source.cluster.popup) {
      this.addClusterPopups(source.cluster.popup, id, this.map);
    }
    const markers = this.createMarkersMap(source);
    const destroy$ = new EventEmitter<void>();

    const markerLayer = { id, markers, source, destroy$ };
    this.layers.push(markerLayer);

    this.events.render$.pipe(
      takeUntil(destroy$),
    ).subscribe(() => this.renderLayer(id, source.idMethod, markers));
  }

  private createMarkersMap<T, C>(
    layer: MarkerLayerSource<T, C>,
  ): Map<string, mapboxgl.Marker> {
    const map = this.map;
    if (!map) {
      throw new Error('Cannot crete marker map. Map is not defined');
    }

    const markers = new Map<string, mapboxgl.Marker>();

    for (const feature of layer.data.features) {
      const position = feature.geometry.coordinates as [number, number];
      const marker = this.createMarker(
        feature.properties,
        mapboxgl.LngLat.convert(position),
        layer.image,
        layer.className,
      );

      const popupSource = layer.popup;
      if (popupSource) {
        this.addMarkerPopup(
          feature.properties,
          marker,
          popupSource,
          map,
        );
      }

      markers.set(layer.idMethod(feature.properties).toString(), marker);
    }

    return markers;
  }

  private createMarker<T>(
    dataObj: T,
    position: LatLng,
    image: MarkerImageSource<T>,
    className: string,
  ): mapboxgl.Marker {
    const element = document.createElement('img');
    element.className = className;

    if (typeof image.source === 'string') {
      element.setAttribute('src', image.source);
    } else {
      for (const condition of image.source) {
        if (condition.predicate(dataObj)) {
          element.setAttribute('src', condition.source);
          break;
        }
      }
    }

    const marker = new mapboxgl.Marker({
      element,
      anchor: image.anchor,
    });
    marker.setLngLat(position);

    return marker;
  }

  private addMarkerPopup<T, C>(
    dataObj: T,
    marker: mapboxgl.Marker,
    source: PopupSource<T, C>,
    map: mapboxgl.Map,
  ): void {
    marker.getElement().addEventListener('mouseover', () => {
      this.createPopup(
        dataObj,
        source,
        map,
        marker.getLngLat(),
        MARKER_POPUP_OFFSET,
        fromEvent(marker.getElement(), 'mouseleave').pipe(
          delay(POPUP_CLOSE_PERIOD),
        ),
      );
    });
  }

  private addClusterPopups<T, C>(
    source: PopupSource<T, C>,
    id: string,
    map: mapboxgl.Map,
  ): void {
    // eslint-disable-next-line
    map.on('mouseover', `${id}-cluster-background`, async ({ features }) => {
      const feature = features?.at(0);
      const properties = feature?.properties;
      if (!feature || !properties) {
        throw new Error('Cannot open cluster popup. Cluster is undefined');
      }

      const mapSource = (this.map?.getSource(id) as mapboxgl.GeoJSONSource);
      const coordinates = (feature.geometry as GeoJSON.Point)
        .coordinates as [number, number];

      const dataObjs = await new Promise((resolve, reject) => {
        mapSource.getClusterLeaves(
          properties['cluster_id'] as number,
          properties['point_count'] as number,
          0,
          (err, features) => {
            if (err) {
              reject(err);
            } else {
              resolve(features.map(
                feature => feature.properties,
              ));
            }
          },
        );
      });

      const closeEvent = new Observable(
        subscriber => {
          map.on(
            'mouseleave',
            `${id}-cluster-background`,
            () => subscriber.next(),
          );
        },
      );

      this.createPopup(
        dataObjs as T,
        source,
        map,
        mapboxgl.LngLat.convert(coordinates),
        CLUSTER_POPUP_OFFSET,
        closeEvent.pipe(delay(POPUP_CLOSE_PERIOD)),
      );
    });
  }

  private createPopup<T, C>(
    dataObj: T,
    source: PopupSource<T, C>,
    map: mapboxgl.Map,
    coordinates: mapboxgl.LngLat,
    offset?: number,
    closeEvent?: Observable<unknown>,
  ): void {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      offset,
      closeOnMove: true,
    });

    const popupContent = this.renderer.injectComponent(
      source.component,
      component => {
        if (source.onInit) {
          source.onInit(component, dataObj);
        }

        if (source.eventHandler) {
          source.eventHandler(component, dataObj);
        }

        if (source.onClose) {
          source.onClose(component, () => popup.remove());
        }

        if (source.registerClose && closeEvent) {
          source.registerClose(
            component,
            closeEvent,
          );
        }
      },
    );

    setTimeout(() => popup
      .setDOMContent(popupContent)
      .setLngLat(coordinates)
      .addTo(map));
  }

  // #endregion

}
