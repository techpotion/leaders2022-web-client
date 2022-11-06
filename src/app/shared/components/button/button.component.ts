import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';


@Component({
  selector: 'button[tpButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {

  constructor(
    public readonly el: ElementRef,
  ) { }

}
