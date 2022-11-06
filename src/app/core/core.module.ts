import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';


@NgModule({
  declarations: [
    LoadingScreenComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LoadingScreenComponent,
  ],
})
export class CoreModule { }
