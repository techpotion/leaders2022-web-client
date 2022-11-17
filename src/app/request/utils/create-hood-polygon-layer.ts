import { PolygonLayerSource } from '../models/map/polygon-layer';

export function createHoodPolygonLayer(
  polygon: GeoJSON.Polygon,
): PolygonLayerSource {
  return {
    data: polygon,
    background: {
      color: '#497963',
      opacity: 0.1,
    },
    stroke: {
      color: '#004425',
      width: 1,
    },
  };
}
