import { ChangeDetectionStrategy, Component, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'button[tpToggle]',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true,
    },
  ],
})
export class ToggleComponent implements ControlValueAccessor {

  constructor() { }


  // #region State

  public readonly enabled = new BehaviorSubject<boolean>(false);

  @HostListener('click')
  public onClick(): void {
    this.enabled.next(!this.enabled.value);
    this.onChange(this.enabled.value);
    this.onTouched();
  }

  // #endregion


  // #region Control value accessor

  public writeValue(obj: boolean | null): void {
    this.enabled.next(obj ?? false);
  }

  // eslint-disable-next-line
  private onChange: (obj: boolean | null) => void = _obj => {};

  public registerOnChange(fn: (obj: boolean | null) => void): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line
  public onTouched: () => void = () => {};

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // #endregion

}
