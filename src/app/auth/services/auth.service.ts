import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';

import { Credentials } from '../models/credentials';
import { SessionData } from '../models/session-data';
import { AuthApiService } from './auth-api.service';


const SESSION_DATA_KEY = 'session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private readonly api: AuthApiService,
  ) { }


  // #region Session Data

  public get sessionData(): SessionData | undefined {
    const storageItem = localStorage.getItem(SESSION_DATA_KEY);
    return storageItem
      ? JSON.parse(storageItem) as SessionData
      : undefined;
  }

  private set sessionData(value: SessionData | undefined) {
    if (value) {
      localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(SESSION_DATA_KEY);
    }
  }

  private readonly sessionDataSubject =
    new BehaviorSubject<SessionData | undefined>(this.sessionData);

  public readonly sessionData$ = this.sessionDataSubject.asObservable();

  // #endregion


  // #region Actions

  public async signIn(credentials: Credentials): Promise<void> {
    if (this.isSignedIn()) {
      throw new Error('Невозможно выполнить вход в систему: '
                      + 'вход был выполнен ранее');
    }

    this.sessionData = await lastValueFrom(this.api.signIn(credentials));
  }

  public async signOut(): Promise<void> {
    if (!this.isSignedIn()) {
      throw new Error('Невозможно выполнить выход из системы: '
                      + 'вход не выполнен');
    }

    await lastValueFrom(this.api.signOut());
    this.clearSession();
  }

  public clearSession(): void {
    this.sessionData = undefined;
  }

  public isSignedIn(): boolean {
    return !!this.sessionData;
  }

  public readonly isSignedIn$ = this.sessionData$.pipe(
    map(sessionData => !!sessionData),
  );

  // #endregion

}
