import { ChangeDetectionStrategy, Component, HostListener, Input, Output } from '@angular/core';
import { BehaviorSubject, map, skip } from 'rxjs';
import { toggleAnimation } from 'src/app/shared/animations/toggle.animation';


@Component({
  selector: 'button[tpRequestsListToggle]',
  templateUrl: './requests-list-toggle.component.html',
  styleUrls: ['./requests-list-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    toggleAnimation(),
  ],
})
export class RequestsListToggleComponent {

  constructor() { }


  // #region Open state

  @Input()
  public set isOpen(value: boolean) {
    this.isOpen$.next(value);
  }


  public get isOpen(): boolean {
    return this.isOpen$.value;
  }

  @HostListener('click')
  public toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  public readonly isOpen$ = new BehaviorSubject<boolean>(false);

  @Output()
  public readonly isOpenChange = this.isOpen$.asObservable().pipe(
      skip(1),
    );

  public readonly animationState = this.isOpen$.pipe(
    map(isOpen => isOpen ? 'open' : 'closed'),
  );

  // #endregion

}
