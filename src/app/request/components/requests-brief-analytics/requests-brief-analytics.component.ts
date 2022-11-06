import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RequestsDataService } from '../../services/requests-data.service';


@Component({
  selector: 'tp-requests-brief-analytics',
  templateUrl: './requests-brief-analytics.component.html',
  styleUrls: ['./requests-brief-analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsBriefAnalyticsComponent {

  constructor(
    public readonly data: RequestsDataService,
  ) { }

}
