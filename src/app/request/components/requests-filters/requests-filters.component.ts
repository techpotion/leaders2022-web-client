import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, map, shareReplay } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import { opacityAppearanceAnimation } from 'src/app/shared/animations/opacity-appearance.animation';
import { SelectOption } from 'src/app/shared/models/select-option';
import { addressAppearanceAnimation } from '../../animations/address-appearance.animation';
import { Urgency } from '../../models/urgency';

import { FilterApiService } from '../../services/filter-api.service';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';


@Component({
  selector: 'tp-requests-filters',
  templateUrl: './requests-filters.component.html',
  styleUrls: ['./requests-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    addressAppearanceAnimation(),
    opacityAppearanceAnimation(),
  ],
})
export class RequestsFiltersComponent {

  constructor(
    public readonly data: RequestsDataService,
    public readonly dialog: DialogService,
    private readonly filterApi: FilterApiService,
    public readonly view: RequestViewService,
  ) { }


  // #region Select options

  public readonly hoods = this.filterApi.getHoods().pipe(
    map(hoods => hoods.map(hood => ({
      value: hood, label: hood,
    }))),
    shareReplay(1),
  );

  public readonly anomalies = [
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

  public readonly services = this.filterApi.getServices().pipe(
    map(services => services.map(service => ({
      value: service, label: service,
    }))),
    shareReplay(1),
  );

  public readonly efficiencies = [
    { label: 'Выполнено', value: 'Выполнено' },
    {
      label: 'Не выполнено по инициативе жителя',
      value: 'Не выполнено по инициативе жителя',
    },
    {
      label: 'Не выполнено по инициативе УК/ОО',
      value: 'Не выполнено по инициативе УК/ОО',
    },
    { label: 'Оказана консультация', value: 'Оказана консультация' },
  ];

  public readonly grades = [
    { label: 'Плохо', value: 'Плохо' },
    { label: 'Неудовлетворительно', value: 'Неудовлетворительно' },
    { label: 'Удовлетворительно', value: 'Удовлетворительно' },
    { label: 'Хорошо', value: 'Хорошо' },
    { label: 'Отлично', value: 'Отлично' },
  ];

  public readonly urgencies = [
    { label: Urgency.Emergency, value: Urgency.Emergency },
    { label: Urgency.Normal, value: Urgency.Normal },
  ];

  public readonly works = this.filterApi.getWorks().pipe(
    map(works => works.map(work => ({
      value: work, label: work,
    }))),
    shareReplay(1),
  );

  public readonly deffects = this.filterApi.getDeffects().pipe(
    map(deffects => deffects.map(deffect => ({
      value: deffect, label: deffect,
    }))),
    shareReplay(1),
  );

  public readonly owners = this.filterApi.getOwners().pipe(
    map(owners => owners.map(owner => ({
      value: owner, label: owner,
    }))),
    shareReplay(1),
  );

  // #endregion


  // #region State

  public readonly areAllOpened = new BehaviorSubject<boolean>(false);

  // #endregion


  // #region Form

  public clearForm(): void {
    this.data.form.controls.backendFilters.reset();
    this.data.form.controls.frontendFilters.reset();
  }

  // #endregion

}
