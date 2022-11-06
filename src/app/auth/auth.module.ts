import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthPageComponent } from './components/auth-page/auth-page.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { ProfileControlsComponent } from './components/profile-controls/profile-controls.component';


@NgModule({
  declarations: [
    AuthPageComponent,
    AuthFormComponent,
    ProfileControlsComponent,
  ],
  exports: [
    ProfileControlsComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class AuthModule { }
