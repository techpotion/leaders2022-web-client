import { GetManyRequest } from 'src/app/core/models/get-many-request';
import { BackendLatLng, fromBackendLatLng, LatLng, toBackendLatLng } from './lat-lng';
import { ValueRange } from './range';
import { Urgency } from './urgency';
import * as moment from 'moment';


export type BackendRequestLocation = { root_id: string } & BackendLatLng;

export interface RequestLocation {
  requestId: string;
  position: LatLng;
}

export function fromBackendRequestLocation(
  location: BackendRequestLocation,
): RequestLocation {
  return {
    requestId: location.root_id,
    position: fromBackendLatLng(location),
  };
}


// #region API Request

export interface BaseBackendRequestLocationsQuery {
  region: string;
  datetime_from: string;
  datetime_to: string;
  x_min?: number;
  y_min?: number;
  x_max?: number;
  y_max?: number;
  serving_company?: string[];
  efficiency?: string[];
  grade_for_service?: string[];
  urgency_category?: string[];
  work_type?: string[];
  deffect_category?: string[];
  owner_company?: string[];
}

export type BackendRequestLocationsQuery =
  BaseBackendRequestLocationsQuery & GetManyRequest;

export interface BaseRequestLocationsQuery {
  region: string;
  datetimeRange: ValueRange<Date>;
  area?: ValueRange<LatLng>;
  service?: string[];
  efficiency?: string[];
  grade?: string[];
  urgency?: Urgency[];
  work?: string[];
  deffect?: string[];
  owner?: string[];
}

export type RequestLocationsQuery =
  BaseRequestLocationsQuery & GetManyRequest;

export function toBaseBackendRequestLocationQuery(
  query: BaseRequestLocationsQuery,
): BaseBackendRequestLocationsQuery {
  const latLngMin = query.area ? toBackendLatLng(query.area.from) : undefined;
  const latLngMax = query.area ? toBackendLatLng(query.area.to) : undefined;
  /* eslint-disable camelcase */
  return {
    region: query.region,
    datetime_from: moment(query.datetimeRange.from).toISOString(true),
    datetime_to: moment(query.datetimeRange.to).toISOString(true),
    x_min: latLngMin?.x,
    y_min: latLngMin?.y,
    x_max: latLngMax?.x,
    y_max: latLngMax?.y,
    serving_company: query.service,
    efficiency: query.efficiency,
    grade_for_service: query.grade,
    urgency_category: query.urgency,
    work_type: query.work,
    deffect_category: query.deffect,
    owner_company: query.owner,
  };
  /* eslint-enable camelcase */
}

export function toBackendRequestLocationQuery(
  query: RequestLocationsQuery,
): BackendRequestLocationsQuery {
  return {
    ...toBaseBackendRequestLocationQuery(query),
    limit: query.limit,
    offset: query.offset,
  };
}

// #endregion
