import { EventEmitter, Type } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Observable } from 'rxjs';

// eslint-disable-next-line
export interface MarkerLayerSource<T = any, MC = any, CC = any> {
  data: GeoJSON.FeatureCollection<GeoJSON.Point, T>;
  idMethod: (obj: T) => number | string;
  image: MarkerImageSource<T>;
  className: string;
  cluster: {
    properties?: object;
    background: string | mapboxgl.Expression;
    color: string;
    popup?: PopupSource<T[], CC>;
  };
  popup?: PopupSource<T, MC>;
}

export interface MarkerImageSource<T> {
  source: string | {
    predicate: (obj: T) => boolean;
    source: string;
  }[];
  anchor: mapboxgl.Anchor;
}

export interface PopupSource<T, C> {
  component: Type<C>;
  onInit?: (component: C, obj: T) => void;
  eventHandler?: (component: C, obj: T) => void;
  onClose?: (component: C, cb: () => void) => void;
  registerClose?: (component: C, closeEvent: Observable<unknown>) => void;
}

// eslint-disable-next-line
export interface MarkerLayer<T = any, C = any> {
  id: string;
  markers: Map<string, mapboxgl.Marker>;
  source: MarkerLayerSource<T, C>;
  // popups?: Map<string, mapboxgl.Popup>;
  destroy$: EventEmitter<void>;
}
