interface RawErrorResponse {
  success: boolean;
}

interface ErroredResponse extends RawErrorResponse {
  success: false;
  error: string;
}

interface UnerroredResponse extends RawErrorResponse {
  success: true;
}

export type ErrorResponse = ErroredResponse | UnerroredResponse;
