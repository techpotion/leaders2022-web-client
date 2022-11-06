import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { isApiUrl } from 'src/app/shared/utils/is-api-url';
import { environment } from 'src/environments/environment';


@Injectable()
export class ApiOriginInterceptor implements HttpInterceptor {

  constructor() {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const url = isApiUrl(request.url)
      ? `${environment.api.origin}${request.url}`
      : request.url;
    return next.handle(request.clone({ url }));
  }

}
