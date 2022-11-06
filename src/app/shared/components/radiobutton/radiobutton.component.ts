import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';

@Component({
  selector: 'button[tpRadiobutton]',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadiobuttonComponent),
      multi: true,
    },
  ],
})
export class RadiobuttonComponent
implements ControlValueAccessor, OnDestroy {

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

  @Output()
  public readonly selectedChange = this.selected$.asObservable();

  private subscribeSelectedChange(): void {
    this.selected$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => this.onChange(value));
  }

  public toggle(): void {
    this.selected = !this.selected;
    this.onChange(this.selected);
    this.onTouched();
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    this.toggle();

    event.stopPropagation();
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
