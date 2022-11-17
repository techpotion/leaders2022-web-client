import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, startWith, takeUntil } from 'rxjs';


const MAX_VISIBLE_OPTIONS = 5;

@Component({
  selector: 'tp-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteInputComponent),
      multi: true,
    },
  ],
  animations: [
    trigger('optionsAppearance', [
      transition(':enter', [
        style({ height: 0 }),
        query('.option', style({ opacity: 0 })),
        sequence([
          animate('.2s ease-out', style({ height: '*' })),
          query(
            '.option',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
        ]),
      ]),
      transition(':leave', [
        sequence([
          query(
            '.option',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
          animate('.2s ease-out', style({ height: 0 })),
        ]),
      ]),
    ]),
  ],
})
export class AutocompleteInputComponent
implements ControlValueAccessor, OnDestroy {

  constructor(
    private readonly el: ElementRef,
  ) {
    this.subscribeControlChange();
  }


  // #region Lifecycle

  private readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Control

  @ViewChild('input')
  public readonly input?: ElementRef<HTMLInputElement>;

  public readonly control = new FormControl('', { nonNullable: true });

  private subscribeControlChange(): void {
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => this.onChange(value));
  }

  public selectOption(option: string): void {
    this.control.setValue(option);
    this.isOpen.next(false);

    this.input?.nativeElement.blur();
    this.onTouched();
  }


  // #endregion


  // #region Open state

  public readonly isOpen = new BehaviorSubject<boolean>(false);

  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: MouseEvent): void {
    if ((this.el.nativeElement as HTMLElement).contains(
      event.target as HTMLElement,
    )) { return; }
    this.isOpen.next(false);
    this.onTouched();
  }

  public onInputContainerClick(): void {
    this.isOpen.next(true);
    this.input?.nativeElement.focus();
  }

  // #endregion


  // #region Options

  @Input()
  public maxVisibleOptions = MAX_VISIBLE_OPTIONS;

  @Input()
  public set options(value: string[]) {
    this.options$.next(value);
  }

  public get options(): string[] {
    return this.options$.value;
  }

  public readonly options$ = new BehaviorSubject<string[]>([]);

  public readonly searchedOptions = combineLatest([
    this.control.valueChanges.pipe(
      startWith(this.control.value),
    ),
    this.options$,
  ]).pipe(
    map(([query, options]) => options.filter(
      option => option.toLowerCase().includes(query.toLowerCase()),
    )),
    map(options => options.slice(0, this.maxVisibleOptions)),
  );

  // #endregion


  // #region Control value accessor

  public writeValue(obj: string | null): void {
    this.control.setValue(obj ?? '');
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
