import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';

import { TokenInterceptor } from 'src/app/auth/interceptors/token.interceptor';
import { ApiOriginInterceptor } from './api-origin.interceptor';


export const interceptorProviders: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiOriginInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },
];
