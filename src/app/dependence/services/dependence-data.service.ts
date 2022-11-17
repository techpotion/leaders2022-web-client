import { EventEmitter, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, map, share, startWith, switchMap, tap } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { ValueRange } from 'src/app/request/models/range';
import { SelectOption } from 'src/app/shared/models/select-option';
import { environment } from 'src/environments/environment';
import { DependenceApiService } from './dependence-api.service';


interface LoadForm {
  datetimeRange: ValueRange<Date> | null;
  dispatcher: SelectOption<string> | null;
}

@Injectable({
  providedIn: 'root',
})
export class DependenceDataService {

  constructor(
    private readonly api: DependenceApiService,
    private readonly fb: FormBuilder,
    private readonly loading: LoadingService,
  ) { }


  // #region Form

  /**
   * Form state when updates were loaded.
   */
  public updateFormState: LoadForm = {
    datetimeRange: null,
    dispatcher: null,
  };

  public readonly form = this.fb.group({
    datetimeRange: [null as ValueRange<Date> | null, [Validators.required]],
    dispatcher: [null as SelectOption<string>[] | null, [Validators.required]],
  });

  public readonly reload = new EventEmitter<void>();

  private readonly reloadForm = this.reload.pipe(
    map(() => this.form.value),
    map(form => ({
      // eslint-disable-next-line
      dispatcher: (form.dispatcher?.at(0) as SelectOption<string> | null)
        ?.value!,
      // eslint-disable-next-line
      datetimeRange: form.datetimeRange!,
    })),
    tap(() => void this.loading.openLoader(
      'Загружаем график. Осталось еще немного.',
    )),
    tap(() => {
      this.updateFormState = this.form.value as LoadForm;
    }),
    share(),
  );

  // #endregion


  // #region Data

  public readonly hasError = new BehaviorSubject<boolean>(false);

  public readonly plot = this.reloadForm.pipe(
    switchMap(query => this.api.getPlot(query)),
    catchError((_, caught) => caught.pipe(startWith(null))),
    tap(value => {
      if (!value) {
        this.hasError.next(true);
        return;
      }
      this.hasError.next(false);
    }),
    map(src => src ? `${environment.api.origin}/data/${src}` : src),
    tap(() => void this.loading.closeLoader()),
    share(),
  );

  // #endregion


}
