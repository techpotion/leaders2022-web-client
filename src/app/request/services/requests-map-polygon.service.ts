import { Injectable } from '@angular/core';
import { PolygonLayer, PolygonLayerSource } from '../models/map/polygon-layer';
import { RequestsMapDataService } from './requests-map-data.service';


@Injectable({
  providedIn: 'root',
})
export class RequestsMapPolygonService {

  constructor(
    private readonly data: RequestsMapDataService,
  ) { }


  // #region Storage

  private layers: PolygonLayer[] = [];

  // #endregion


  // #region Removement

  private removeLayer(layer: PolygonLayer): void {
    this.data.removeLayer(`${layer.id}-background`);
    this.data.removeLayer(`${layer.id}-stroke`);
    this.data.removeSource(layer.id);
  }

  public removeLayers(): void {
    for (const layer of this.layers) {
      this.removeLayer(layer);
    }
    this.layers = [];
  }

  // #endregion


  // #region Addition

  public addLayer(
    id: string,
    source: PolygonLayerSource,
  ): void {
    this.data.addSource(id, {
      type: 'geojson',
      data: source.data,
    });

    this.data.addLayer({
      id: `${id}-background`,
      type: 'fill',
      source: id,
      paint: {
        'fill-color': source.background.color,
        'fill-opacity': source.background.opacity,
      },
    });

    this.data.addLayer({
      id: `${id}-stroke`,
      type: 'line',
      source: id,
      paint: {
        'line-color': source.stroke.color,
        'line-width': source.stroke.width,
      },
    });

    const layer = { id, source };
    this.layers.push(layer);
  }
  // #endregion

}
