import { FullRequest } from '../full-request';
import { LatLng } from '../lat-lng';


export interface HeatmapAnomaly {
  position: LatLng;
  fullAddress: string;
  anomalyRequestsCount: number;
}

export function createHeatmapAnomalies(
  requests: FullRequest[],
): HeatmapAnomaly[] {
  const filteredRequests = requests.filter(
    request => request.anomaly.exists,
  );
  const map = new Map<string, HeatmapAnomaly>();

  for (const request of filteredRequests) {
    const key = request.address.full;
    const currentValue = map.get(key) ?? {
      position: request.position,
      fullAddress: key,
      anomalyRequestsCount: 0,
    };
    const newValue = {
      ...currentValue,
      anomalyRequestsCount: currentValue.anomalyRequestsCount + 1,
    };
    map.set(key, newValue);
  }

  return Array.from(map.values());
}
