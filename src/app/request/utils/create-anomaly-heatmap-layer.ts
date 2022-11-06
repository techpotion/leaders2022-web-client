import { HeatmapAnomaly } from '../models/map/heatmap-anomaly';
import { HeatmapLayerSource } from '../models/map/heatmap-layer';
import { createHeatmapAnomalyGeoJson } from './create-heatmap-anomaly-geojson';

export function createAnomalyHeatmapLayer(
  anomalies: HeatmapAnomaly[],
): HeatmapLayerSource<HeatmapAnomaly> {
  return {
    data: createHeatmapAnomalyGeoJson(anomalies),
    property: 'anomalyRequestsCount',
    radiusStops: [
      { zoom: 8, radius: 1 },
      { zoom: 10, radius: 4 },
      { zoom: 11, radius: 8 },
      { zoom: 12, radius: 16 },
      { zoom: 13, radius: 32 },
      { zoom: 14, radius: 64 },
      { zoom: 15, radius: 128 },
      { zoom: 16, radius: 256 },
    ],
  };
}
