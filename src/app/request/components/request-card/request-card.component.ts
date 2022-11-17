import { animate, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, filter, firstValueFrom, map, merge, startWith } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { opacityAppearanceAnimation } from 'src/app/shared/animations/opacity-appearance.animation';
import { FullRequest } from '../../models/full-request';
import { Urgency } from '../../models/urgency';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';
import { RequestsMapControlService } from '../../services/requests-map-control.service';


const MOUSE_EVENT_DEBOUCE_PERIOD = 100;

@Component({
  selector: 'tp-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    opacityAppearanceAnimation(),
    trigger('fullOpen', [
      transition(':enter', [
        style({ height: 0 }),
        query('.partition-container', style({ opacity: 0 })),
        query('.close-button-container', style({ opacity: 0 })),
        sequence([
          animate('.2s ease-out', style({ height: '*' })),
          group([
            query(
              '.partition-container',
              animate('.2s ease-out', style({ opacity: '*' })),
            ),
            query(
              '.close-button-container',
              animate('.2s ease-out', style({ opacity: '*' })),
            ),
          ]),
        ]),
      ]),
      transition(':leave', [
        sequence([
          group([
            query(
              '.partition-container',
              animate('.2s ease-out', style({ opacity: 0 })),
            ),
            query(
              '.close-button-container',
              animate('.2s ease-out', style({ opacity: 0 })),
            ),
          ]),
        ]),
        animate('.2s ease-out', style({ height: 0 })),
      ]),
    ]),
  ],
})
export class RequestCardComponent implements OnInit, OnDestroy {

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly data: RequestsDataService,
    public readonly dialog: DialogService,
    private readonly loading: LoadingService,
    private readonly mapControls: RequestsMapControlService,
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
    if (!this.request) {
      throw new Error('Cannot open request. Request is not defined');
    }

    this.isFullOpen.next(isOpen ?? !this.isFullOpen.value);

    if (this.isFullOpen.value) {
      this.mapControls.zoomTo(this.request.position);
    }
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
