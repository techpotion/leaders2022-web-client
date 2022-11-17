import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TUI_DATE_TIME_VALUE_TRANSFORMER } from '@taiga-ui/kit';
import { map, takeUntil } from 'rxjs';
import { ValueRange } from 'src/app/request/models/range';
import { DatetimeValueTransformer } from '../../utils/datetime-value-transformer';


@Component({
  selector: 'tp-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_DATE_TIME_VALUE_TRANSFORMER,
      useClass: DatetimeValueTransformer,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true,
    },
  ],
})
export class DateRangeComponent implements ControlValueAccessor, OnDestroy {

  constructor(
    private readonly fb: FormBuilder,
  ) {
    this.subscribeOnChange();
  }


  // #region Lifecycle

  private readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Form

  public readonly form = this.fb.group<ValueRange<Date | null>>({
    from: null,
    to: null,
  });

  // #endregion


  // #region Control value accessor

  public writeValue(obj: ValueRange<Date> | null): void {
    this.form.setValue(obj ?? { from: null, to: null });
  }

  // eslint-disable-next-line
  private onChange: (obj: ValueRange<Date> | null) => void = _obj => {};

  public registerOnChange(fn: (obj: ValueRange<Date> | null) => void): void {
    this.onChange = fn;
  }

  private subscribeOnChange(): void {
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
      map(value => {
        if (value.from === null || value.to === null) {
          return null;
        }
        return value as ValueRange<Date>;
      }),
    ).subscribe(val => this.onChange(val));
  }

  // eslint-disable-next-line
  public onTouched: () => void = () => {};

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // #endregion

}
