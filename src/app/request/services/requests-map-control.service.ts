import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
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

  // #endregion


  // #region Rendering

  public resize(): void {
    this.map?.resize();
  }

  // #endregion

}
