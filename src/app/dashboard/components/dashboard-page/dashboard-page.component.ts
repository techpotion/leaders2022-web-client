import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { DashboardDataService } from '../../services/dashboard-data.service';

@Component({
  selector: 'tp-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements AfterViewInit {

  constructor(
    private readonly data: DashboardDataService,
    private readonly loader: LoadingService,
  ) {
    if (this.data.isFormValid()) {
      this.data.reload.emit();
    }
  }


  // #region Lifecycle

  public ngAfterViewInit(): void {
    this.loader.finishNavigationLoading();
  }

  // #endregion

}
