import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Injectable({
  providedIn: 'root',
})
export class RequestsMapDataService {

  constructor() { }


  // #region Init

  private map?: mapboxgl.Map;

  public init(map: mapboxgl.Map): void {
    this.map = map;
  }

  // #endregion


  // #region Layers

  public addLayer(layer: mapboxgl.AnyLayer): void {
    this.map?.addLayer(layer);
  }

  public removeLayer(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.map?.getLayer(id)) {
      this.map.removeLayer(id);
    }
  }

  // #endregion


  // #region Sources

  public addSource(id: string, source: mapboxgl.GeoJSONSourceRaw): void {
    this.map?.addSource(id, source);
  }

  public removeSource(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.map?.getSource(id)) {
      this.map.removeSource(id);
    }
  }

  // #endregion

}
