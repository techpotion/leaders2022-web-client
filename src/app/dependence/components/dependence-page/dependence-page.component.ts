import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { DependenceDataService } from '../../services/dependence-data.service';

@Component({
  selector: 'tp-dependence-page',
  templateUrl: './dependence-page.component.html',
  styleUrls: ['./dependence-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencePageComponent implements AfterViewInit {

  constructor(
    public readonly data: DependenceDataService,
    private readonly loader: LoadingService,
  ) { }


  // #region Lifecycle

  public ngAfterViewInit(): void {
    this.loader.finishNavigationLoading();
  }

  // #endregion

}
