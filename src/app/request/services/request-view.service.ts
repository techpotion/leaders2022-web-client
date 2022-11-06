import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, firstValueFrom, map, shareReplay, take } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { createHeatmapAnomalies } from '../models/map/heatmap-anomaly';
import { createMarkerRequest } from '../models/map/marker-request';
import { RequestsDataService } from '../services/requests-data.service';
import { RequestsMapControlService } from '../services/requests-map-control.service';
import { RequestsMapEventService } from '../services/requests-map-event.service';
import { RequestsMapMarkerService } from '../services/requests-map-marker.service';
import { createAnomalyHeatmapLayer } from '../utils/create-anomaly-heatmap-layer';
import { createRequestMarkerLayer } from '../utils/create-request-marker-layer';
import { RequestsMapHeatmapService } from './requests-map-heatmap.service';


const SCROLL_END_PERIOD = 100;

@Injectable({
  providedIn: 'root',
})
export class RequestViewService {

  constructor(
    private readonly data: RequestsDataService,
    private readonly loading: LoadingService,
    private readonly mapControls: RequestsMapControlService,
    private readonly mapEvents: RequestsMapEventService,
    private readonly mapHeatmaps: RequestsMapHeatmapService,
    private readonly mapMarkers: RequestsMapMarkerService,
  ) {
    this.subscribeEmptyList();
    this.subscribeMapResize();
    this.subscribeMarkerAdding();
    this.subscribeHeatmapAdding();
  }


  // #region List

  private listScroll?: CdkVirtualScrollViewport;

  public init(virtualScroll: CdkVirtualScrollViewport): void {
    this.listScroll = virtualScroll;
  }

  public async scrollToRequest(id: string, open = true): Promise<void> {
    if (!this.listScroll) {
      throw new Error('Cannot scroll to request. List scroll is not defined');
    }

    const elementId = `request-card-${ id}`;
    const fullList = await firstValueFrom(this.data.requests);
    const index = fullList.findIndex(request => request.id === id);
    if (index < 0) {
      throw new Error('Cannot scroll to request. Request is not found');
    }

    if (open) {
      this.requestOpen.emit(id);
    }
    const element = document.getElementById(elementId);
    if (element) {
      this.scrollToElement(element);
      return;
    }

    this.listScroll.scrollToIndex(index, 'smooth');
    this.listScroll.elementScrolled().pipe(
      map(() => document.getElementById(elementId)),
      filter(element => !!element),
      take(1),
    ).subscribe(element => setTimeout(
      () => this.scrollToElement(element!), SCROLL_END_PERIOD,
    ));
  }

  private scrollToElement(element: HTMLElement): void {
    element.scrollIntoView({
      block: 'start',
      inline: 'start',
      behavior: 'smooth',
    });
  }

  public readonly listVisible = new BehaviorSubject<boolean>(true);

  public toggleList(): void {
    this.listVisible.next(!this.listVisible.value);
  }

  private readonly requestOpen = new EventEmitter<string>();

  public readonly requestOpen$ = this.requestOpen.pipe(
    shareReplay(1),
  );


  private subscribeMapResize(): void {
    this.listVisible.pipe().subscribe(
      () => setTimeout(() => this.mapControls.resize()),
    );
  }

  private subscribeEmptyList(): void {
    this.data.requests.pipe(
      filter(requests => requests.length === 0),
      filter(() => !this.listVisible.value),
    ).subscribe(() => this.toggleList());
  }

  // #endregion


  // #region Heatmap

  public readonly heatmapEnabled = new BehaviorSubject<boolean>(false);

  private readonly heatmapAnomalies = combineLatest([
    this.heatmapEnabled,
    this.data.requests,
  ]).pipe(
    filter(([heatmapEnabled]) => heatmapEnabled),
    map(([,requests]) => createHeatmapAnomalies(requests)),
  );

  private subscribeHeatmapAdding(): void {
    this.heatmapAnomalies.subscribe(anomalies => {
      if (!this.loading.globalScreen.value) {
        void this.loading.openLoader('Загружаем тепловую карту. Осталось еще немного.');
      }

      this.mapMarkers.removeLayers();
      this.mapHeatmaps.removeLayers();

      if (!anomalies.length) {
        void this.loading.closeLoader();
        return;
      }

      this.mapHeatmaps.addLayer(
        'anomaly-heatmap', createAnomalyHeatmapLayer(anomalies),
      );

      void firstValueFrom(this.mapEvents.sourceLoadComplete$).then(
        () => void this.loading.closeLoader(),
      );
    });
  }

  // #endregion


  // #region Marker

  public readonly markerRequests = combineLatest([
    this.heatmapEnabled,
    this.data.requests,
  ]).pipe(
    filter(([heatmapEnabled]) => !heatmapEnabled),
    map(([,requests]) => requests.map(request => createMarkerRequest(request))),
  );

  private subscribeMarkerAdding(): void {
    this.markerRequests.subscribe(requests => {
      if (!this.loading.globalScreen.value) {
        void this.loading.openLoader('Загружаем маркеры. Осталось еще немного.');
      }

      this.mapMarkers.removeLayers();
      this.mapHeatmaps.removeLayers();

      if (!requests.length) {
        void this.loading.closeLoader();
        return;
      }

      this.mapMarkers.addLayer(
        'request-markers', createRequestMarkerLayer(requests),
      );

      void firstValueFrom(this.mapEvents.sourceLoadComplete$).then(
        () => void this.loading.closeLoader(),
      );
    });
  }

  // #endregion

}
