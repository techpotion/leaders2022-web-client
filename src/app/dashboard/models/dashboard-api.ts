import * as moment from 'moment';
import { ValueRange } from 'src/app/request/models/range';

export interface DashboardQuery {
  region: string;
  datetimeRange: ValueRange<Date>;
}

export interface BackendDashboardQuery {
  region: string;
  datetime_from: string;
  datetime_to: string;
}

export function toBackendDashboardQuery(
  query: DashboardQuery,
): BackendDashboardQuery {
  return {
    region: query.region,
    // eslint-disable-next-line
    datetime_from: moment(query.datetimeRange.from).toISOString(true),
    // eslint-disable-next-line
    datetime_to: moment(query.datetimeRange.to).toISOString(true),
  };
}
