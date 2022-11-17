import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, first, firstValueFrom, lastValueFrom, map, shareReplay, take } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { createHeatmapAnomalies, HeatmapAnomaly } from '../models/map/heatmap-anomaly';
import { createMarkerRequest, MarkerRequest } from '../models/map/marker-request';
import { RequestsDataService } from '../services/requests-data.service';
import { RequestsMapControlService } from '../services/requests-map-control.service';
import { RequestsMapEventService } from '../services/requests-map-event.service';
import { RequestsMapMarkerService } from '../services/requests-map-marker.service';
import { createAnomalyHeatmapLayer } from '../utils/create-anomaly-heatmap-layer';
import { createHoodPolygonLayer } from '../utils/create-hood-polygon-layer';
import { createRequestMarkerLayer } from '../utils/create-request-marker-layer';
import { FilterApiService } from './filter-api.service';
import { RequestsMapHeatmapService } from './requests-map-heatmap.service';
import { RequestsMapPolygonService } from './requests-map-polygon.service';


const SCROLL_END_PERIOD = 100;
const MAP_RESIZE_PERIOD = 10;
type ListAnimationState = 'opened' | 'closing' | 'opening' | 'closed';

@Injectable({
  providedIn: 'root',
})
export class RequestViewService {

  constructor(
    private readonly api: FilterApiService,
    private readonly data: RequestsDataService,
    private readonly loader: LoadingService,
    private readonly mapControls: RequestsMapControlService,
    private readonly mapEvents: RequestsMapEventService,
    private readonly mapHeatmaps: RequestsMapHeatmapService,
    private readonly mapMarkers: RequestsMapMarkerService,
    private readonly mapPolygons: RequestsMapPolygonService,
  ) {
    this.subscribeEmptyList();
    this.subscribeMarkerAdding();
    this.subscribeHeatmapCreation();
    this.subscribeHoodChange();
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

  private readonly requestOpen = new EventEmitter<string>();

  public readonly requestOpen$ = this.requestOpen.pipe(
    shareReplay(1),
  );

  private subscribeEmptyList(): void {
    this.data.requests.pipe(
      filter(requests => requests.length === 0),
      filter(() => this.listAnimationState.value === 'closed'),
    ).subscribe(() => this.toggleList(true));
  }

  // #endregion


  // #region Animation

  public toggleList(isOpened: boolean): void {
    if ((isOpened && this.listAnimationState.value !== 'closed')
      || (!isOpened && this.listAnimationState.value !== 'opened')) {
      return;
    }
    this.listAnimationState.next(isOpened ? 'opening' : 'closing');
  }

  public readonly listAnimationState = new BehaviorSubject<ListAnimationState>('opened');

  public readonly listAnimationEnd = new EventEmitter<void>();

  public onListAnimationStart(): void {
    const interval = setInterval(
      () => this.mapControls.resize(), MAP_RESIZE_PERIOD,
    );
    this.listAnimationEnd.pipe(
      first(),
    ).subscribe(() => {
      clearInterval(interval);
      if (this.listAnimationState.value === 'opening') {
        this.listAnimationState.next('opened');
        return;
      }
      if (this.listAnimationState.value === 'closing') {
        this.listAnimationState.next('closed');

      }
    });
  }

  public onInputAnimationEnd(): void {
    if (this.listAnimationState.value === 'opening') {
      this.listAnimationState.next('opened');

    }
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

  private subscribeHeatmapCreation(): void {
    this.heatmapAnomalies.subscribe(
      anomalies => void this.createHeatmap(anomalies),
    );
  }

  private async createHeatmap(anomalies: HeatmapAnomaly[]): Promise<void> {
    console.log('create heatmap');
    if (!this.loader.dataLoading.value) {
      void this.loader.openLoader('Загружаем тепловую карту. Осталось еще немного.');
    }

    await this.beforeDataOnMap();

    if (!anomalies.length) {
      void this.loader.closeLoader();
      return;
    }

    const sourceId = 'anomaly-heatmap';
    this.mapHeatmaps.addLayer(
      sourceId, createAnomalyHeatmapLayer(anomalies),
    );
    const heatmapCreated = this.mapEvents.sourceLoadComplete$.pipe(
      filter(value => (value as unknown as {
        sourceId: string;
      }).sourceId === sourceId),
    );
    await firstValueFrom(heatmapCreated);

    void this.loader.closeLoader();
  }

  // #endregion


  // #region Common map view

  private clearMapLayers(): void {
    this.mapMarkers.removeLayers();
    this.mapHeatmaps.removeLayers();
    this.mapPolygons.removeLayers();
  }

  private async fitHoodInsideMap(zoomIn = true): Promise<void> {
    const hood = this.data.updateFormState.backend?.region?.at(0)?.value;
    if (!hood) {
      throw new Error('Cannot fit map in region. Region is not selected');
    }
    const hoodPolygon = await lastValueFrom(this.api.getHoodArea(hood));

    if (zoomIn) {
      this.mapControls.fitPolygonBounds(hoodPolygon);
    }

    const sourceId = 'hood-polygon';
    this.mapPolygons.addLayer(sourceId, createHoodPolygonLayer(hoodPolygon));

    await firstValueFrom(this.mapEvents.sourceLoadComplete$.pipe(
      filter(
        value => (value as unknown as {
          sourceId: string;
        }).sourceId === sourceId,
      ),
    ));
  }

  /**
   * Should be true to zoom map on data loading once
   */
  public firstDataLoad = true;

  private subscribeHoodChange(): void {
    const filters = this.data.form.controls.backendFilters;
    filters.controls.region.valueChanges.subscribe(
      () => { this.firstDataLoad = true; },
    );
  }

  private async beforeDataOnMap(): Promise<void> {
    this.clearMapLayers();

    await this.fitHoodInsideMap(this.firstDataLoad);
    if (this.firstDataLoad) {
      this.firstDataLoad = false;
    }
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
    this.markerRequests.subscribe(
      requests => void this.createMarkers(requests),
    );
  }

  private async createMarkers(requests: MarkerRequest[]): Promise<void> {
    if (!this.loader.dataLoading.value) {
      void this.loader.openLoader('Загружаем маркеры. Осталось еще немного.');
    }

    await this.beforeDataOnMap();

    if (!requests.length) {
      void this.loader.closeLoader();
      return;
    }

    const sourceId = 'request-markers';
    this.mapMarkers.addLayer(
      sourceId, createRequestMarkerLayer(requests),
    );
    const markersCreated = this.mapEvents.sourceLoadComplete$.pipe(
      filter(value => (value as unknown as {
        sourceId: string;
      }).sourceId === sourceId),
    );
    await firstValueFrom(markersCreated);

    void this.loader.closeLoader();
  }

  // #endregion

}
