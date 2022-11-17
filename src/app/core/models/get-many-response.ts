import { ErrorResponse } from './error-response';

interface RawGetManyResponse {
  count: number;
}

export type GetManyResponse = RawGetManyResponse & ErrorResponse;
