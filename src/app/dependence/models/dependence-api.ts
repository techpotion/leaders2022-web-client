import * as moment from 'moment';
import { ValueRange } from 'src/app/request/models/range';

export interface DependencePlotQuery {
  datetimeRange: ValueRange<Date>;
  dispatcher: string;
}

export interface BackendDependencePlotQuery {
  datetime_from: string;
  datetime_to: string;
  dispatcher: string;
}

export function toBackendDependecePlotQuery(
  query: DependencePlotQuery,
): BackendDependencePlotQuery {
  return {
    dispatcher: query.dispatcher,
    // eslint-disable-next-line
    datetime_from: moment(query.datetimeRange.from).toISOString(true),
    // eslint-disable-next-line
    datetime_to: moment(query.datetimeRange.to).toISOString(true),
  };
}
