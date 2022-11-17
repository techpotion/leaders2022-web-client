import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DependenceRoutingModule } from './dependence-routing.module';
import { DependencePageComponent } from './components/dependence-page/dependence-page.component';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { DependenceFormComponent } from './components/dependence-form/dependence-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DependencePageComponent,
    DependenceFormComponent,
  ],
  imports: [
    DependenceRoutingModule,
    AuthModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class DependenceModule { }
