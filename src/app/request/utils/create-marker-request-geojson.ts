import { MarkerRequest } from '../models/map/marker-request';

export function createMarkerRequestGeoJson(
  requests: MarkerRequest[],
): GeoJSON.FeatureCollection<GeoJSON.Point, MarkerRequest> {
  return {
    type: 'FeatureCollection',
    features: requests.map(request => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          request.position.lng,
          request.position.lat,
        ],
      },
      properties: request,
    })),
  };
}
