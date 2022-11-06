import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { filter, map, merge } from 'rxjs';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';
import { RequestsPageDialogService } from '../../services/requests-page-dialog.service';


@Component({
  selector: 'tp-requests-page',
  templateUrl: './requests-page.component.html',
  styleUrls: ['./requests-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsPageComponent implements OnDestroy {

  constructor(
    public readonly data: RequestsDataService,
    public readonly dialog: RequestsPageDialogService,
    public readonly view: RequestViewService,
  ) { }


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
        this.data.form.value,
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
