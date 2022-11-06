import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/guards/auth.guard';
import { NotAuthGuard } from './auth/guards/not-auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'requests',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [NotAuthGuard],
    canActivateChild: [NotAuthGuard],
  },
  {
    path: 'requests',
    loadChildren: () => import('./request/request.module').then(m => m.RequestModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
