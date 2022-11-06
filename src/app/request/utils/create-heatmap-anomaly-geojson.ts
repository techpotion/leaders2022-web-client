import { HeatmapAnomaly } from '../models/map/heatmap-anomaly';

export function createHeatmapAnomalyGeoJson(
  anomalies: HeatmapAnomaly[],
): GeoJSON.FeatureCollection<GeoJSON.Point, HeatmapAnomaly> {
  return {
    type: 'FeatureCollection',
    features: anomalies.map(anomaly => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          anomaly.position.lng,
          anomaly.position.lat,
        ],
      },
      properties: anomaly,
    })),
  };
}
