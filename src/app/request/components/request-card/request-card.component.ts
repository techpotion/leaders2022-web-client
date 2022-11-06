import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, filter, firstValueFrom, map, merge, startWith } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { FullRequest } from '../../models/full-request';
import { Urgency } from '../../models/urgency';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';
import { RequestsPageDialogService } from '../../services/requests-page-dialog.service';


const MOUSE_EVENT_DEBOUCE_PERIOD = 100;

@Component({
  selector: 'tp-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestCardComponent implements OnInit, OnDestroy {

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly data: RequestsDataService,
    public readonly dialog: RequestsPageDialogService,
    private readonly loading: LoadingService,
    private readonly view: RequestViewService,
  ) {
  }


  // #region Lifecycle

  public readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  public ngOnInit(): void {
    this.subscribeOpening();
  }

  // #endregion


  // #region Content

  @Input()
  public request?: FullRequest;

  public readonly urgencyType = Urgency;

  // #endregion


  // #region Marking anomalies

  @HostListener('mouseover')
  public onMouseover(): void {
    this.mouseover.emit();
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.mouseleave.emit();
  }

  private readonly mouseover = new EventEmitter<void>();

  private readonly mouseleave = new EventEmitter<void>();

  public readonly markingButtonVisible = merge(
    this.mouseover.pipe(
      map(() => true),
      debounceTime(MOUSE_EVENT_DEBOUCE_PERIOD),
    ),
    this.mouseleave.pipe(
      map(() => false),
      debounceTime(MOUSE_EVENT_DEBOUCE_PERIOD),
    ),
  ).pipe(
    startWith(false),
  );

  public async toggleAnomalyMark(): Promise<void> {
    if (!this.request) {
      throw new Error('Cannot mark anomaly. Request is not passed.');

    }
    await this.loading.openLoader();
    await this.data.markAnomaly(this.request.id, !this.request.anomaly.exists);
    await firstValueFrom(this.data.requests);
    this.cd.detectChanges();
  }

  // #endregion


  // #region Full/brief state

  public readonly isFullOpen = new BehaviorSubject<boolean>(false);

  public toggleFull(isOpen?: boolean): void {
    this.isFullOpen.next(isOpen ?? !this.isFullOpen.value);
  }

  public async onCloseButtonClick(): Promise<void> {
    if (!this.request) {
      throw new Error('Cannot close request. Request is not defined');
    }
    this.toggleFull(false);
    await this.view.scrollToRequest(this.request.id, false);
  }

  private subscribeOpening(): void {
    this.view.requestOpen$.pipe(
      filter(id => this.request?.id === id),
      filter(() => !this.isFullOpen.value),
    ).subscribe(() => this.toggleFull(true));
  }

  // #endregion

}
