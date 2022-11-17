import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { first } from 'rxjs';
import { RequestsMapEventService } from './requests-map-event.service';


@Injectable({
  providedIn: 'root',
})
export class RequestsMapDataService {

  constructor(
    private readonly events: RequestsMapEventService,
  ) { }


  // #region Init

  private map?: mapboxgl.Map;

  public init(map: mapboxgl.Map): void {
    this.map = map;

    this.events.load$.pipe(
      first(),
    ).subscribe(() => {
      for (const cb of this.loadCallbacks) {
        cb();
      }
      this.loadCallbacks = [];
    });
  }

  public loadCallbacks: (() => unknown)[] = [];

  // #endregion


  // #region Layers

  public addLayer(layer: mapboxgl.AnyLayer): void {
    if (!this.map || !this.events.isLoaded) {
      this.loadCallbacks.push(() => this.addLayer(layer));
      return;
    }

    this.map.addLayer(layer);
  }

  public removeLayer(id: string): void {
    if (!this.map || !this.events.isLoaded) {
      this.loadCallbacks.push(() => this.removeLayer(id));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.map.getLayer(id)) {
      this.map.removeLayer(id);
    }
  }

  // #endregion


  // #region Sources

  public addSource(id: string, source: mapboxgl.GeoJSONSourceRaw): void {
    if (!this.map || !this.events.isLoaded) {
      this.loadCallbacks.push(() => this.addSource(id, source));
      return;
    }

    this.map.addSource(id, source);
  }

  public removeSource(id: string): void {
    if (!this.map || !this.events.isLoaded) {
      this.loadCallbacks.push(() => this.removeSource(id));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.map.getSource(id)) {
      this.map.removeSource(id);
    }
  }

  // #endregion

}
