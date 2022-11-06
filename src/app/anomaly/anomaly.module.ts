import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnomalyFaqDialogComponent } from './components/anomaly-faq-dialog/anomaly-faq-dialog.component';


@NgModule({
  declarations: [
    AnomalyFaqDialogComponent,
  ],
  exports: [
    AnomalyFaqDialogComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class AnomalyModule { }
