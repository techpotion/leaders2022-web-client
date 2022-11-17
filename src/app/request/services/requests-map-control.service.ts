import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { LatLng } from '../models/lat-lng';
import { ValueRange } from '../models/range';


@Injectable({
  providedIn: 'root',
})
export class RequestsMapControlService {

  constructor() { }


  // #region Init

  private map?: mapboxgl.Map;

  public init(map: mapboxgl.Map): void {
    this.map = map;
  }

  // #endregion


  // #region Zoom

  public zoomIn(): void {
    this.map?.zoomIn();
  }

  public zoomOut(): void {
    this.map?.zoomOut();
  }

  public zoomTo(latLng: LatLng): void {
    this.map?.flyTo({ center: latLng, zoom: environment.map.zoom.max });
  }

  // #endregion


  // #region Bounds

  public getBounds(): ValueRange<LatLng> | undefined {
    const bounds = this.map?.getBounds();
    if (!bounds) { return undefined; }

    return {
      from: mapboxgl.LngLat.convert(bounds.getSouthWest()),
      to: mapboxgl.LngLat.convert(bounds.getNorthEast()),
    };
  }

  public fitBounds(bounds: mapboxgl.LngLatBoundsLike): void {
    this.map?.fitBounds(bounds, { padding: 20 });
  }

  public fitPolygonBounds(polygon: GeoJSON.Polygon): void {
    const coords = polygon.coordinates.flat().map(
      position => mapboxgl.LngLat.convert(position as [number, number]),
    );
    if (!coords.length) {
      throw new Error('Cannot convert polygon into bounds');
    }

    /* eslint-disable */
    const sw = {
      lat: coords.map(coord => coord.lat).sort((a, b) => a - b)[0]!,
      lng: coords.map(coord => coord.lng).sort((a, b) => a - b)[0]!,
    };
    const ne = {
      lat: coords.map(coord => coord.lat).sort((a, b) => b - a)[0]!,
      lng: coords.map(coord => coord.lng).sort((a, b) => b - a)[0]!,
    }
    /* eslint-enable */
    this.fitBounds(new mapboxgl.LngLatBounds([sw, ne]));
  }

  // #endregion


  // #region Rendering

  public resize(): void {
    this.map?.resize();
  }

  // #endregion

}
