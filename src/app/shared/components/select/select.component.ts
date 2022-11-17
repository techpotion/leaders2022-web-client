import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  merge,
  skip,
  startWith,
  takeUntil,
} from 'rxjs';
import { toggleAnimation } from '../../animations/toggle.animation';
import { SelectOption } from '../../models/select-option';


const VIRTUAL_SCROLL_MIN_ITEMS = 50;

@Component({
  selector: 'tp-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  animations: [
    toggleAnimation(),
    trigger('options', [
      transition(':enter', [
        style({ height: 0 }),
        query('.option', style({ opacity: 0 })),
        sequence([
          animate('.2s ease-out', style({ height: '*' })),
          query('.option', animate(
            '.2s ease-out', style({ opacity: '*' }),
          )),
        ]),
      ]),
      transition(':leave', [
        sequence([
          query('.option', animate(
            '.2s ease-out', style({ opacity: 0 }),
          )),
          animate('.2s ease-out', style({ height: 0 })),
        ]),
      ]),
    ]),
  ],
})
export class SelectComponent
implements ControlValueAccessor, OnInit, OnDestroy {

  constructor(
    private readonly el: ElementRef,
    private readonly fb: FormBuilder,
  ) {
  }


  // #region Lifecycle

  public ngOnInit(): void {
    this.subscribeSearchControlValue();
    this.subscribeOnChange();
    this.subscribeOnTouched();
  }

  private readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Options

  @Input()
  public set options(value: SelectOption[]) {
    this.options$.next(value);
  }

  public get options(): SelectOption[] {
    return this.options$.value;
  }

  private readonly options$ = new BehaviorSubject<SelectOption[]>([]);

  public readonly singleControl = this.fb.control<SelectOption | null>(null);

  public select(option: SelectOption | null): void {
    if (this.multiple) {
      this.selectMultiple(option);
      return;
    }

    if (option) {
      this.singleControl.setValue(option);
    } else {
      this.singleControl.reset();
    }
    this.isOpen.next(false);
  }

  // #endregion


  // #region Multiple

  @Input()
  public multiple = false;

  @Input()
  public allowAll = true;

  public readonly multipleControl = new BehaviorSubject<SelectOption[]>([]);

  public readonly allSelected = this.multipleControl.pipe(
    startWith(this.multipleControl.value),
    map(value => value.length === this.options.length),
  );

  private selectMultiple(option: SelectOption | null): void {
    if (!option) {
      const allSelected =
        this.multipleControl.value.length === this.options.length;
      this.multipleControl.next(allSelected ? [] : this.options);
      return;
    }

    const value = [ ...this.multipleControl.value ];
    const optionIndex = value.findIndex(
      valueOption => valueOption.value === option.value,
    );
    if (optionIndex !== -1) {
      value.splice(optionIndex, 1);
      this.multipleControl.next(value);
      return;
    }
    value.push(option);
    this.multipleControl.next(value);
  }

  @Input()
  public multiplePlaceholderFn: (options: SelectOption[]) => string
      = options => `Выбрано: ${ options.length}`;

  // #endregion


  // #region Searching

  @ViewChild('searchInput')
  public readonly searchInput?: ElementRef<HTMLInputElement>;

  public readonly searchControl =
    new FormControl<string>('', { nonNullable: true });

  public readonly searchedOptions = combineLatest([
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      filter(() => this.isOpen.value),
    ),
    this.options$,
  ]).pipe(
    map(([query, options]) => options.filter(
      option => option.label.toLowerCase().includes(
        query.toLowerCase(),
      ),
    )),
  );

  public readonly virtualScrollEnabled = this.searchedOptions.pipe(
    map(options => options.length >= VIRTUAL_SCROLL_MIN_ITEMS),
  );

  // #endregion


  // #region Hints

  @Input()
  public placeholder = 'Выбрать';

  private subscribeSearchControlValue(): void {
    combineLatest([
      this.isOpen,
      this.searchControlUpdate,
    ]).subscribe(([isOpen]) => {
      if (isOpen) {
        this.searchControl.setValue('');
        this.searchControl.enable();
        this.searchInput?.nativeElement.focus();
        return;
      }

      if (this.multiple) {
        const value = this.multipleControl.value;
        if (value.length === 0) {
          this.searchControl.setValue(this.placeholder);
        } else if (value.length === this.options.length) {
          this.searchControl.setValue('Все');
        } else {
          this.searchControl.setValue(this.multiplePlaceholderFn(value));
        }

        this.searchControl.disable();
        return;
      }

      const value = this.singleControl.value;
      if (value) {
        this.searchControl.setValue(value.label);
      } else {
        this.searchControl.setValue(this.placeholder);
      }

      this.searchControl.disable();
    });
  }

  private readonly searchControlUpdate = new EventEmitter<void>();

  // #endregion


  // #region Faq

  @Input()
  public hasFaq = false;

  public onFaqButtonClick(event: MouseEvent): void {
    event.stopPropagation();
    this.faqClick.emit();
  }

  @Output()
  public readonly faqClick = new EventEmitter<void>();

  // #endregion


  // #region Open state

  public toggleIsOpen(event: MouseEvent): void {
    if (this.animationInProgress.value) { return; }
    const element = event.target as HTMLElement | null;
    if (element?.classList.contains('faq-button')) { return; }

    this.isOpen.next(!this.isOpen.value);
  }

  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: MouseEvent): void {
    if ((this.el.nativeElement as HTMLElement).contains(
      event.target as HTMLElement,
    )) { return; }
    this.isOpen.next(false);
  }

  public readonly isOpen = new BehaviorSubject<boolean>(false);

  public readonly animationInProgress = new BehaviorSubject<boolean>(false);

  public readonly animationState = this.isOpen.pipe(
    map(isOpen => isOpen ? 'open' : 'closed'),
  );

  // #endregion


  // #region Control value accessor

  public writeValue(obj: SelectOption[] | null): void {
    if (this.multiple) {
      this.multipleControl.next(obj ?? []);
      this.searchControlUpdate.emit();
      return;
    }
    this.singleControl.setValue(obj?.at(0) ?? null);
    this.searchControlUpdate.emit();
  }

  // eslint-disable-next-line
  private onChange: (obj: SelectOption[] | null) => void = _obj => {};

  public registerOnChange(fn: (obj: SelectOption[] | null) => void): void {
    this.onChange = fn;
  }

  private subscribeOnChange(): void {
    merge(
      this.singleControl.valueChanges.pipe(
        filter(() => !this.multiple),
        map(value => value ? [value] : value),
      ),
      this.multipleControl.pipe(
        skip(1),
        filter(() => this.multiple),
      ),
    ).subscribe(value => this.onChange(value));
  }

  // eslint-disable-next-line
  public onTouched: () => void = () => {};

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private subscribeOnTouched(): void {
    this.isOpen.pipe(
      filter(isOpen => !isOpen),
      takeUntil(this.destroy$),
    ).subscribe(() => this.onTouched());
  }

  // #endregion

}
