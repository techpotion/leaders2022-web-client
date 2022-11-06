import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MarkerRequest } from '../../models/map/marker-request';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsPageDialogService } from '../../services/requests-page-dialog.service';


@Component({
  selector: 'tp-request-marker-popup',
  templateUrl: './request-marker-popup.component.html',
  styleUrls: ['./request-marker-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestMarkerPopupComponent implements OnDestroy {

  constructor(
    public readonly dialog: RequestsPageDialogService,
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

    if (!this.view.listVisible.value) {
      this.view.toggleList();
    }
    setTimeout(() => void this.view.scrollToRequest(request.id));
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
