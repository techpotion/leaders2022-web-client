interface RawGetManyResponse {
  count: number;
  success: boolean;
}

interface ErroredGetManyResponse extends RawGetManyResponse {
  success: false;
  error: string;
}

interface UnerroredGetManyResponse extends RawGetManyResponse {
  success: true;
}

export type GetManyResponse = ErroredGetManyResponse | UnerroredGetManyResponse;
