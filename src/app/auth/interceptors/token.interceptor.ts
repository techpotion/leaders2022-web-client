import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { isApiUrl } from 'src/app/shared/utils/is-api-url';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private readonly auth: AuthService,
  ) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const updatedRequest = this.auth.sessionData && isApiUrl(request.url)
      ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.sessionData.token}`,
        },
      })
      : request;
    return next.handle(updatedRequest);
  }


}
