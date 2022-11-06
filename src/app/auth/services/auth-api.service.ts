import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { Observable, of, switchMap, throwError } from 'rxjs';
import { Credentials } from '../models/credentials';

import { SessionData } from '../models/session-data';


const VALID_CREDENTIALS = {
  username: 'leadershack2022',
  password: 'techpotion',
};

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {

  constructor(
  ) { }

  public signIn(credentials: Credentials): Observable<SessionData> {
    // TODO
    return of({ token: 'token' }).pipe(
      switchMap(data => {
        if (_.isEqual(credentials, VALID_CREDENTIALS)) {
          return of(data);
        }
        return throwError(() => new Error('Неверный логин или пароль'));
      }),
    );
  }

  public signOut(): Observable<null> {
    return of(null); // TODO
  }

}
