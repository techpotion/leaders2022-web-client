import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { interceptorProviders } from './core/interceptors/interceptor-providers';

import { CoreModule } from './core/core.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    ...interceptorProviders,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
