import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { MarkerRequest } from '../../models/map/marker-request';
import { RequestViewService } from '../../services/request-view.service';


@Component({
  selector: 'tp-request-cluster-popup',
  templateUrl: './request-cluster-popup.component.html',
  styleUrls: ['./request-cluster-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestClusterPopupComponent implements OnDestroy {

  constructor(
    private readonly view: RequestViewService,
  ) { }


  // #region Lifecycle

  public readonly destroy$ = new EventEmitter<void>();

  public ngOnDestroy(): void {
    this.destroy$.emit();
  }

  // #endregion


  // #region Content

  public get requests(): MarkerRequest[] {
    return this.requests$.value;
  }

  @Input()
  public set requests(value: MarkerRequest[]) {
    this.requests$.next(value);
  }

  private readonly requests$ = new BehaviorSubject<MarkerRequest[]>([]);

  public readonly incidentRequests = this.requests$.pipe(
    map(requests => requests.filter(
      request => request.isIncident && request.anomaly.exists,
    )),
  );

  public readonly incidentRequestsCount = this.incidentRequests.pipe(
    map(requests => requests.length),
  );

  public readonly anomalyRequests = this.requests$.pipe(
    map(requests => requests.filter(
      request => request.anomaly.exists && !request.isIncident,
    )),
  );

  public readonly anomalyRequestsCount = this.anomalyRequests.pipe(
    map(requests => requests.length),
  );

  public readonly normalRequests = this.requests$.pipe(
    map(requests => requests.filter(
      request => !request.isIncident && !request.anomaly.exists,
    )),
  );

  public readonly normalRequestsCount = this.normalRequests.pipe(
    map(requests => requests.length),
  );

  public readonly groupedRequests = combineLatest([
    this.incidentRequests.pipe(
      map(requests => requests.map(request => ({
        ...request,
        image: 'assets/icons/maroon-marker.svg',
      }))),
    ),
    this.anomalyRequests.pipe(
      map(requests => requests.map(request => ({
        ...request,
        image: 'assets/icons/red-marker.svg',
      }))),
    ),
    this.normalRequests.pipe(
      map(requests => requests.map(request => ({
        ...request,
        image: 'assets/icons/green-marker.svg',
      }))),
    ),
  ]).pipe(
    map(([incidents, anomalies, normals]) => [
      ...incidents, ...anomalies, ...normals,
    ]),
  );

  // #endregion


  // #region Actions

  public openFull(request: MarkerRequest): void {
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
