import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'button[tpRequestsFiltersUpdateButton]',
  templateUrl: './requests-filters-update-button.component.html',
  styleUrls: ['./requests-filters-update-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsFiltersUpdateButtonComponent {

  constructor() { }

}
