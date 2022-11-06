import * as mapboxgl from 'mapbox-gl';
import { FullRequest } from '../full-request';
import { LatLng } from '../lat-lng';
import { Address, Deffect } from '../request-details';

export interface MarkerRequest {
  id: string;
  number: string;
  address: Address;
  deffect: Deffect;
  position: LatLng;
  isIncident: boolean;
  anomaly: {
    exists: boolean;
    isCustom: boolean;
    cases: number[];
  };
}

export function createMarkerRequest(
  request: FullRequest,
): MarkerRequest {
  return {
    id: request.id,
    number: request.number,
    address: request.address,
    deffect: request.deffect,
    position: request.position,
    isIncident: request.isIncident,
    anomaly: request.anomaly,
  };
}

export const GET_ANOMALY_EXPRESSION: mapboxgl.Expression =
  ['get', 'exists', ['get', 'anomaly']];
