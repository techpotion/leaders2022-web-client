import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RequestsDataService } from '../../services/requests-data.service';


@Component({
  selector: 'tp-anomaly-only-toggle',
  templateUrl: './anomaly-only-toggle.component.html',
  styleUrls: ['./anomaly-only-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnomalyOnlyToggleComponent {

  constructor(
    public readonly data: RequestsDataService,
  ) { }

}
