import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardDataService } from '../../services/dashboard-data.service';


@Component({
  selector: 'tp-dashboard-anomaly-analytics',
  templateUrl: './dashboard-anomaly-analytics.component.html',
  styleUrls: ['./dashboard-anomaly-analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAnomalyAnalyticsComponent {

  constructor(
    public readonly data: DashboardDataService,
  ) { }

}
