import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { HeatmapLayer, HeatmapLayerSource } from '../models/map/heatmap-layer';
import { RequestsMapDataService } from './requests-map-data.service';


@Injectable({
  providedIn: 'root',
})
export class RequestsMapHeatmapService {

  constructor(
    private readonly data: RequestsMapDataService,
  ) { }


  // #region Addition

  public addLayer<T>(
    id: string, source: HeatmapLayerSource<T>,
  ): void {
    this.data.addSource(id, {
      type: 'geojson',
      data: source.data,
    });

    const radiusStops = source.radiusStops.map(
      ({ zoom, radius }) => [ zoom, radius ],
    );

    const layer: mapboxgl.HeatmapLayer = {
      id,
      type: 'heatmap',
      source: id,
      paint: {
        'heatmap-radius': {
          stops: radiusStops,
        },
        'heatmap-opacity': 0.3,
      },
    };

    const heatProperty = source.property;
    const propertyValues = source.data.features.map(
      feature => feature.properties[heatProperty],
    );

    if (!layer.paint) {
      layer.paint = {};
    }
    layer.paint['heatmap-weight'] = {
      property: 'heatness',
      stops: [
        [_.min(propertyValues), 0],
        [_.max(propertyValues), 1],
      ],
    };

    this.data.addLayer(layer);
    this.layers.push({ id, source });
  }


  // #region Storage

  private layers: HeatmapLayer[] = [];

  // #endregion


  // #region Removement

  private removeLayer(layer: HeatmapLayer): void {
    this.data.removeLayer(layer.id);
    this.data.removeSource(layer.id);
  }

  public removeLayers(): void {
    for (const layer of this.layers) {
      this.removeLayer(layer);
    }
    this.layers = [];
  }

  // #endregion

}
