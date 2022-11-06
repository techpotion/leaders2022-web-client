import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { SelectOption } from 'src/app/shared/models/select-option';
import { Urgency } from '../../models/urgency';

import { RegionApiService } from '../../services/region-api.service';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';
import { RequestsPageDialogService } from '../../services/requests-page-dialog.service';


@Component({
  selector: 'tp-requests-filters',
  templateUrl: './requests-filters.component.html',
  styleUrls: ['./requests-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsFiltersComponent {

  constructor(
    public readonly data: RequestsDataService,
    public readonly dialog: RequestsPageDialogService,
    private readonly regionApi: RegionApiService,
    public readonly view: RequestViewService,
  ) { }


  // #region Select options

  public readonly regionOptions = this.regionApi.getMany().pipe(
    map(regions => regions.map(region => ({
      value: region,
      label: region,
    }))),
  );

  public readonly urgencyOptions = [
    { label: Urgency.Emergency, value: Urgency.Emergency },
    { label: Urgency.Normal, value: Urgency.Normal },
  ];

  public readonly anomalyOptions = [
    { label: 'Аномалия 1', value: 1 },
    { label: 'Аномалия 2', value: 2 },
    { label: 'Аномалия 3', value: 3 },
    { label: 'Аномалия 4', value: 4 },
    { label: 'Аномалия 5', value: 5 },
    { label: 'Аномалия 6', value: 6 },
    { label: 'Аномалия 7', value: 7 },
  ];

  public anomalyPlaceholderFn(options: SelectOption[]): string {
    return `${options.map(option => option.value).join(', ')}`;
  }

  // #endregion

}
