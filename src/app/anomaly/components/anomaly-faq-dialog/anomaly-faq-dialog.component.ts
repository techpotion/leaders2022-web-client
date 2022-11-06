import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Output } from '@angular/core';


@Component({
  selector: 'tp-anomaly-faq-dialog',
  templateUrl: './anomaly-faq-dialog.component.html',
  styleUrls: ['./anomaly-faq-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnomalyFaqDialogComponent {

  constructor() { }


  @Output()
  public readonly dialogClose = new EventEmitter<void>();

  @HostListener('click')
  public onClick(): void {
    this.dialogClose.emit();
  }

}
