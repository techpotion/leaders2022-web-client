import { EventEmitter, Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


@Injectable({
  providedIn: 'root',
})
export class RequestsMapEventService {

  constructor() { }


  // #region Init

  /**
   * Service init with map event
   */
  public readonly init$ = new EventEmitter<mapboxgl.Map>();

  public init(map: mapboxgl.Map): void {
    // Lifecycle
    this.init$.emit(map);
    this.isLoaded = false;
    map.on('load', event => {
      this.load$.emit(event);
      this.isLoaded = true;
    });
    map.on('render', event => this.render$.emit(event));

    // Loading data
    map.on('sourcedata', event => this.sourceLoadComplete$.emit(event));
  }

  public isLoaded = false;

  // #endregion


  // #region Lifecycle events

  public readonly load$ = new EventEmitter<mapboxgl.MapboxEvent>();

  public readonly render$ = new EventEmitter<mapboxgl.MapboxEvent>();

  // #endregion


  // #region Loading data

  public readonly sourceLoadComplete$ =
    new EventEmitter<mapboxgl.MapboxEvent>();

  // #endregion

}
