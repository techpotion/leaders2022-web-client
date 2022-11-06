import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';


@Component({
  selector: 'button[tpCheckbox]',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tick', [
      transition(':enter', [
        style({ transform: 'scale(0.8)' }),
        animate('.3s ease-out', style({ transform: '*' })),
      ]),
      transition(':leave', [
        animate('.3s ease-out', style({ transform: 'scale(0.8)' })),
      ]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor, OnDestroy {

  constructor() {
    this.subscribeSelectedChange();
  }


  // #region Lifecycle

  private readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Selected state

  @Input()
  public set selected(value: boolean) {
    this.selected$.next(value);
  }

  public get selected(): boolean {
    return this.selected$.value;
  }

  public readonly selected$ = new BehaviorSubject<boolean>(false);

  private subscribeSelectedChange(): void {
    this.selected$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => this.onChange(value));
  }

  private toggle(): void {
    this.selected = !this.selected;
    this.onChange(this.selected);
    this.onTouched();
  }

  @HostListener('click')
  public onClick(): void {
    this.toggle();
  }

  // #endregion


  // #region Control value accessor

  public writeValue(obj: boolean | null): void {
    this.selected = !!obj;
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
