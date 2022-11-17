import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { filter, first, map, merge } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { opacityAppearanceAnimation } from 'src/app/shared/animations/opacity-appearance.animation';
import { listAppearanceAnimation } from '../../animations/list-appearance.animation';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';
import { RequestsMapEventService } from '../../services/requests-map-event.service';


@Component({
  selector: 'tp-requests-page',
  templateUrl: './requests-page.component.html',
  styleUrls: ['./requests-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    opacityAppearanceAnimation(),
    listAppearanceAnimation(),
  ],
})
export class RequestsPageComponent implements OnDestroy {

  constructor(
    public readonly data: RequestsDataService,
    public readonly loader: LoadingService,
    private readonly mapEvents: RequestsMapEventService,
    public readonly view: RequestViewService,
  ) {
    this.loader.startNavigationLoading(
      true, 'Загружаем карту, осталось еще немного.',
    );
    this.mapEvents.load$.pipe(first()).subscribe(() => {
      this.loader.finishNavigationLoading();
    });

    this.view.firstDataLoad = true;
    this.data.clearFormState();

    if (this.data.form.valid) {
      this.data.reload.emit();
    }
  }


  // #region Lifecycle

  private readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Filters

  public readonly loadButtonVisible = merge(
    this.data.form.valueChanges.pipe(
      filter(() => this.data.form.valid),
      map(() => !_.isEqual(
        {
          frontend: this.data.form.value.frontendFilters,
          backend: this.data.form.value.backendFilters,
        },
        this.data.updateFormState,
      )),
    ),
    this.data.form.valueChanges.pipe(
      filter(() => this.data.form.invalid),
      map(() => false),
    ),
    this.data.requests.pipe(
      map(() => false),
    ),
  );

  // #endregion

}
