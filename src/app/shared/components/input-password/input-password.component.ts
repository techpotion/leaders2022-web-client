import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, map, takeUntil } from 'rxjs';


@Component({
  selector: 'tp-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true,
    },
  ],
})
export class InputPasswordComponent implements ControlValueAccessor, OnDestroy {

  constructor(
    private readonly el: ElementRef,
  ) {
    this.subscribeOnChange();
  }


  // #region Lifecycle

  private readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Visibility

  private toggleVisibility(): void {
    this.visible.next(!this.visible.value);
  }

  public onVisibilityToggleClick(event: MouseEvent): void {
    event.preventDefault();
    this.toggleVisibility();
  }

  private readonly visible = new BehaviorSubject<boolean>(false);

  public readonly inputType = this.visible.pipe(
    map(visible => visible ? 'text' : 'password'),
  );

  public readonly buttonIconSrc = this.visible.pipe(
    map(visible => visible ? 'open' : 'closed'),
    map(suffix => `assets/icons/eye-${suffix}.svg`),
  );

  public readonly buttonIconAlt = this.visible.pipe(
    map(visible => visible ? 'close' : 'closed'),
  );

  // #endregion


  // #region Input HTML element

  @Input()
  public inputId?: string;

  @HostBinding('class')
  public classes = 'tp-input';

  @ViewChild('input')
  public input?: ElementRef<HTMLInputElement>;

  @HostListener('click', ['$event'])
  public onSelfClick(event: PointerEvent): void {
    if (event.target !== this.el.nativeElement) { return; }
    this.input?.nativeElement.focus();
  }

  public onEnterKeydown(event: Event): void {
    event.preventDefault();
    this.enterKeydown.emit();
  }

  @Output()
  public readonly enterKeydown = new EventEmitter<void>();

  // #endregion


  // #region Value

  public readonly control = new FormControl<string>('');

  private subscribeOnChange(): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => this.onChange(value));
  }

  // #endregion


  // #region Validity

  @HostBinding('class.invalid')
  @Input()
  public invalid = false;

  // #endregion


  // #region Control value accessor

  public writeValue(obj: string | null): void {
    this.control.setValue(obj);
  }

  // eslint-disable-next-line
  private onChange: (obj: string | null) => void = _obj => {};

  public registerOnChange(fn: (obj: string | null) => void): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line
  public onTouched: () => void = () => {};

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // #endregion

}
