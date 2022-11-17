import { EventEmitter, Injectable } from '@angular/core';
import { map, shareReplay, switchMap, tap, zip } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ValueRange } from 'src/app/request/models/range';
import { RequestsDataService } from 'src/app/request/services/requests-data.service';
import { SelectOption } from 'src/app/shared/models/select-option';
import { AnomalyDynamicsChartElement } from '../models/anomaly-dynamics-chart';
import { DashboardQuery } from '../models/dashboard-api';
import { DashboardApiService } from './dashboard-api.service';


interface FilterForm {
  datetimeRange: ValueRange<Date> | null;
  region: SelectOption<string> | null;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {

  constructor(
    private readonly api: DashboardApiService,
    private readonly data: RequestsDataService,
    private readonly loading: LoadingService,
  ) {
    this.subscribeMetricsLoaded();
  }


  // #region loading

  /**
   * Form state when updates were loaded.
   */
  public updateFormState: FilterForm = {
    datetimeRange: null,
    region: null,
  };

  public get formValue(): FilterForm {
    const dataFormValue = this.data.form.value.backendFilters;
    const region = dataFormValue?.region?.at(0) as SelectOption<string> | null;
    return {
      datetimeRange: dataFormValue?.datetimeRange ?? null,
      region,
    };
  }

  public isFormValid(): boolean {
    const controls = this.data.form.controls.backendFilters.controls;
    return controls.datetimeRange.valid && controls.region.valid;
  }

  public readonly reload = new EventEmitter<void>();

  private readonly reloadForm = this.reload.pipe(
    map(() => this.formValue),
    map(formValue => ({
      // eslint-disable-next-line
      region: formValue.region?.value!,
      // eslint-disable-next-line
      datetimeRange: formValue.datetimeRange!,
    })),
    tap(() => void this.loading.openLoader(
      'Загружаем дашборд. Осталось еще немного.',
    )),
    tap(() => {
      this.updateFormState = this.formValue;
    }),
  );

  // #endregion


  // #region metrics

  public readonly analytics = this.reloadForm.pipe(
    switchMap(query => this.api.getAnomalyAnalytics(query)),
    shareReplay(1),
  );

  public readonly caseChart = this.reloadForm.pipe(
    switchMap(query => this.api.getAnomalyCaseChartData(query)),
    shareReplay(1),
  );

  public readonly dynamicsChart = this.reloadForm.pipe(
    switchMap(query => this.api.getAnomalyDynamicsChartData(query).pipe(
      map(chartData => ({ query, chartData })),
    )),
    shareReplay<{
      query: DashboardQuery;
      chartData: AnomalyDynamicsChartElement[];
    }>(1),
  );

  public readonly deffectRating = this.reloadForm.pipe(
    switchMap(query => this.api.getDeffectRating(query)),
    shareReplay(1),
  );

  public readonly ownerRating = this.reloadForm.pipe(
    switchMap(query => this.api.getOwnerRating(query)),
    shareReplay(1),
  );

  public readonly serviceRating = this.reloadForm.pipe(
    switchMap(query => this.api.getServiceRating(query)),
    shareReplay(1),
  );

  private subscribeMetricsLoaded(): void {
    this.metricsLoaded.subscribe(() => void this.loading.closeLoader());
  }

  public readonly metricsLoaded = zip([
    this.analytics,
    this.caseChart,
    this.dynamicsChart,
    this.deffectRating,
    this.ownerRating,
    this.serviceRating,
  ]);

  // #endregion

}
