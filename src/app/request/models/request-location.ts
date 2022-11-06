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
  urgency_category?: string;
}

export type BackendRequestLocationsQuery =
  BaseBackendRequestLocationsQuery & GetManyRequest;

export interface BaseRequestLocationsQuery {
  region: string;
  datetimeRange: ValueRange<Date>;
  area?: ValueRange<LatLng>;
  urgency?: Urgency;
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
    urgency_category: query.urgency,
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
