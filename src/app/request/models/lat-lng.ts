export interface BackendLatLng {
  x: number;
  y: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export function fromBackendLatLng(
  latLng: BackendLatLng,
): LatLng {
  return {
    lat: latLng.y,
    lng: latLng.x,
  };
}

export function toBackendLatLng(
  latLng: LatLng,
): BackendLatLng {
  return {
    x: latLng.lng,
    y: latLng.lat,
  };
}
