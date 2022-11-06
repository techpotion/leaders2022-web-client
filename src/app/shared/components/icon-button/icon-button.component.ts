import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'button[tpIconButton]',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {

  constructor() { }

}
