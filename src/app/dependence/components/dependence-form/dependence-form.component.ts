import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { filter, map, merge, shareReplay } from 'rxjs';
import { DependenceApiService } from '../../services/dependence-api.service';
import { DependenceDataService } from '../../services/dependence-data.service';

@Component({
  selector: 'tp-dependence-form',
  templateUrl: './dependence-form.component.html',
  styleUrls: ['./dependence-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependenceFormComponent implements OnDestroy {

  constructor(
    private readonly api: DependenceApiService,
    public readonly data: DependenceDataService,
  ) { }


  // #region Lifecycle

  public ngOnDestroy(): void {
    this.data.form.reset();
    this.data.hasError.next(false);
  }

  // #endregion


  // #region Submit

  public readonly submitButtonEnabled = merge(
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
    this.data.plot.pipe(
      map(() => false),
    ),
  );

  // #endregion


  public readonly dispatchers = this.api.getDispatchers().pipe(
    map(dispatchers => dispatchers.map(dispatcher => ({
      value: dispatcher, label: dispatcher,
    }))),
    shareReplay(1),
  );

}
