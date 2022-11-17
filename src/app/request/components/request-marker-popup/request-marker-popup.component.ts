import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, filter, first } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import { MarkerRequest } from '../../models/map/marker-request';
import { RequestViewService } from '../../services/request-view.service';


@Component({
  selector: 'tp-request-marker-popup',
  templateUrl: './request-marker-popup.component.html',
  styleUrls: ['./request-marker-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestMarkerPopupComponent implements OnDestroy {

  constructor(
    public readonly dialog: DialogService,
    private readonly view: RequestViewService,
  ) { }


  // #region Lifecycle

  public readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Content

  @Input()
  public request?: MarkerRequest;

  // #endregion


  // #region Actions

  public openFull(): void {
    const request = this.request;
    if (!request) {
      throw new Error('Cannot open full request. Request is not defined.');
    }

    if (this.view.listAnimationState.value !== 'opened') {
      this.view.toggleList(true);
    }
    this.view.listAnimationState.pipe(
      filter(state => state === 'opened'),
      first(),
    ).subscribe(() => void this.view.scrollToRequest(request.id));
  }

  @Output()
  public readonly popupClose = new EventEmitter<void>();

  public readonly mouseInside = new BehaviorSubject<boolean>(false);

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.mouseInside.next(false);
    this.popupClose.emit();
  }

  @HostListener('mouseover')
  public onMouseOver(): void {
    this.mouseInside.next(true);
  }

  // #endregion

}
