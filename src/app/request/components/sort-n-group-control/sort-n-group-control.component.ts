import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { RequestGroupOption, RequestSortOption } from '../../models/request-sort-options';


interface SortNGroupValue {
  sort: RequestSortOption | null;
  group: RequestGroupOption | null;
}

@Component({
  selector: 'tp-sort-n-group-control',
  templateUrl: './sort-n-group-control.component.html',
  styleUrls: ['./sort-n-group-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SortNGroupControlComponent),
      multi: true,
    },
  ],
})
export class SortNGroupControlComponent implements ControlValueAccessor {

  constructor(
    private readonly el: ElementRef,
  ) { }


  // #region Open state

  public readonly isOpen = new BehaviorSubject<boolean>(false);

  public toggleIsOpen(isOpen?: boolean): void {
    this.isOpen.next(isOpen ?? !this.isOpen.value);
  }


  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: MouseEvent): void {
    const selfEl = this.el.nativeElement as HTMLElement;
    const targetEl = event.target as HTMLElement;
    if (selfEl.contains(targetEl)) { return; }

    this.toggleIsOpen(false);
  }

  // #endregion


  // #region Control

  public readonly sortControl =
    new BehaviorSubject<RequestSortOption | null>(null);

  public readonly sortOption = RequestSortOption;

  public setSortOption(option: RequestSortOption): void {
    this.onTouched();

    if (this.sortControl.value === option) {
      this.sortControl.next(null);
      this.onChange(this.getValue());
      return;
    }
    this.sortControl.next(option);
    this.onChange(this.getValue());
  }

  public readonly groupControl =
    new BehaviorSubject<RequestGroupOption | null>(null);

  public readonly groupOption = RequestGroupOption;

  public setGroupOption(option: RequestGroupOption): void {
    this.onTouched();

    if (this.groupControl.value === option) {
      this.groupControl.next(null);
      this.onChange(this.getValue());
      return;
    }
    this.groupControl.next(option);
    this.onChange(this.getValue());
  }

  public readonly selected = combineLatest([
    this.sortControl,
    this.groupControl,
  ]).pipe(
    map(([sortValue, groupValue]) => !!sortValue || !!groupValue),
  );

  private getValue(): SortNGroupValue | null {
    if (!this.sortControl.value && !this.groupControl.value) {
      return null;
    }
    return { sort: this.sortControl.value, group: this.groupControl.value };
  }

  // #endregion


  // #region Control value accessor

  public writeValue(obj: SortNGroupValue | null): void {
    if (!obj) {
      this.groupControl.next(null);
      this.sortControl.next(null);
      return;
    }
    this.groupControl.next(obj.group);
    this.sortControl.next(obj.sort);
  }

  // eslint-disable-next-line
  private onChange: (obj: SortNGroupValue | null) => void = _obj => {};

  public registerOnChange(fn: (obj: SortNGroupValue | null) => void): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line
  public onTouched: () => void = () => {};

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // #endregion

}
