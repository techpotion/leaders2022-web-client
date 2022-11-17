import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'button[tpFiltersUpdateButton]',
  templateUrl: './filters-update-button.component.html',
  styleUrls: ['./filters-update-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersUpdateButtonComponent {

  constructor() { }

}
