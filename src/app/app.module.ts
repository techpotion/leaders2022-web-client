import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { TuiRootModule } from '@taiga-ui/core';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { interceptorProviders } from './core/interceptors/interceptor-providers';

import { CoreModule } from './core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AnomalyModule } from './anomaly/anomaly.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AnomalyModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    ReactiveFormsModule,
    TuiRootModule,
  ],
  providers: [
    ...interceptorProviders,
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_RUSSIAN_LANGUAGE),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
