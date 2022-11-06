import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  public canActivate(): boolean | UrlTree {
    return !this.auth.isSignedIn() || this.router.parseUrl('/');
  }

  public canActivateChild(): boolean | UrlTree {
    return this.canActivate();
  }

}
