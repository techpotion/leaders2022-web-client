import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as _ from 'lodash';
import { filter, map, merge } from 'rxjs';
import { FilterApiService } from 'src/app/request/services/filter-api.service';
import { RequestsDataService } from 'src/app/request/services/requests-data.service';
import { opacityAppearanceAnimation } from 'src/app/shared/animations/opacity-appearance.animation';
import { DashboardDataService } from '../../services/dashboard-data.service';


@Component({
  selector: 'tp-dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    opacityAppearanceAnimation(),
  ],
})
export class DashboardFiltersComponent {

  constructor(
    private readonly data: DashboardDataService,
    private readonly filterApi: FilterApiService,
    public readonly formData: RequestsDataService,
  ) { }


  // #region Select options

  public readonly hoods = this.filterApi.getHoods().pipe(
    map(hoods => hoods.map(hood => ({
      value: hood, label: hood,
    }))),
  );

  // #endregion


  // #region Update button

  public readonly updateButtonVisible = merge(
    this.formData.form.valueChanges.pipe(
      filter(() => this.data.isFormValid()),
      map(() => !_.isEqual(
        this.data.formValue,
        this.data.updateFormState,
      )),
    ),
    this.formData.form.valueChanges.pipe(
      filter(() => !this.data.isFormValid()),
      map(() => false),
    ),
    this.data.metricsLoaded.pipe(
      map(() => false),
    ),
  );


  public onUpdateClick(): void {
    this.data.reload.emit();
  }

  // #endregion

}
