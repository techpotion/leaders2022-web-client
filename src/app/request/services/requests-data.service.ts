import { EventEmitter, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { filter, forkJoin, lastValueFrom, map, Observable, of, shareReplay, startWith, switchMap, tap, zip } from 'rxjs';
import { SelectOption } from 'src/app/shared/models/select-option';
import { ValueRange } from '../models/range';
import { AnomalyApiService } from 'src/app/anomaly/services/anomaly-api.service';
import { RequestApiService } from './request-api.service';
import { FullRequest } from '../models/full-request';
import { BaseRequestLocationsQuery } from '../models/request-location';
import { mergeAnomalyIntoRequests, mergeFullRequestArray } from '../utils/merge-full-request';
import { LoadingService } from 'src/app/core/services/loading.service';
import * as _ from 'lodash';
import { RequestGroupOption, RequestSortOption } from '../models/request-sort-options';
import { sortRequests } from '../utils/sort-requests';
import { groupRequests } from '../utils/group-requests';
// import {RequestsMapEventService} from './requests-map-event.service';


// const MAP_RENDER_DEBOUNCE_PERIOD = 300;

interface UpdateForm {
  datetimeRange: ValueRange<Date> | null;
  region: SelectOption<string>[] | null;
}

interface FilterForm {
  address: string;
  anomalyCases: SelectOption<number>[];
  urgency: SelectOption<string>[] | null;
}

interface Form {
  update?: UpdateForm;
  filter?: FilterForm;
}

@Injectable({
  providedIn: 'root',
})
export class RequestsDataService {

  constructor(
    private readonly anomalyApi: AnomalyApiService,
    private readonly fb: FormBuilder,
    // private readonly mapControl: RequestsMapControlService,
    // private readonly mapEvents: RequestsMapEventService,
    private readonly requestApi: RequestApiService,
    private readonly loading: LoadingService,
  ) { }


  // #region Inputs

  public readonly form = this.fb.group({
    update: this.fb.group({
      datetimeRange: [null as ValueRange<Date> | null, [Validators.required]],
      region: [null as SelectOption<string>[] | null, [Validators.required]],
    }),
    filter: this.fb.group({
      address: [''],
      anomalyCases: [[] as SelectOption<number>[]],
      urgency: [null as SelectOption<string>[] | null],
    }),
    sort: [{
      group: RequestGroupOption.AnomalyFirst as RequestGroupOption | null,
      sort: RequestSortOption.CloseDateDescending as RequestSortOption | null,
    }],
  });

  /**
   * Form state when updates were loaded.
   */
  public readonly updateFormState: Form = {};

  public readonly reload = new EventEmitter<void>();

  // #endregion


  // #region Data

  private getFullRequests(
    query: BaseRequestLocationsQuery,
  ): Observable<FullRequest[]> {
    return this.requestApi.getLocations(query).pipe(
      switchMap(locations => {
        const ids = locations.map(location => location.requestId);
        if (!locations.length) { return of([]); }
        return forkJoin([
          this.requestApi.getRequests(ids),
          this.anomalyApi.getSuspects(ids),
        ]).pipe(
          map(([requests, suspects]) =>
            mergeFullRequestArray(locations, requests, suspects)),
        );
      }),
    );
  }

  public async markAnomaly(id: string, isAnomaly: boolean): Promise<void> {
    await lastValueFrom(this.anomalyApi.mark(id, isAnomaly));
    this.anomalyMarkedRequestId.emit(id);
  }

  private readonly anomalyMarkedRequestId = new EventEmitter<string>();

  public readonly loadedRequests = this.reload.pipe(
    filter(() => !_.isEqual(
      this.form.value.update,
      this.updateFormState.update,
    )),
    tap(() => void this.loading.openLoader(
      'Загружаем заявки. Осталось еще немного.',
    )),
    switchMap(() => this.getFullRequests({
      /* eslint-disable */
      region: (this.form.value.update?.region?.at(0) as SelectOption<string> | null)?.value!,
      datetimeRange: this.form.value.update?.datetimeRange!,
      /* eslint-enable */
    })),
    tap(() => {
      this.updateFormState.update = this.form.value.update as UpdateForm;
    }),
  );

  private readonly markedRequests = this.loadedRequests.pipe(
    switchMap(fullRequests => this.anomalyMarkedRequestId.pipe(
      tap(() => void this.loading.openLoader(
        'Загружаем заявки. Осталось еще немного.',
      )),
      startWith(null),
      switchMap(id => id
        ? this.anomalyApi.getSuspects([id])
        : of(null)),
      map(anomalySuspects => {
        if (!anomalySuspects) { return fullRequests; }
        const suspect = anomalySuspects[0];
        if (!suspect) {
          throw new Error(
            'Cannot update requests list. Anomaly suspect not found.',
          );
        }
        return mergeAnomalyIntoRequests(suspect, fullRequests);
      }),
    )),
  );

  private readonly filteredRequests = this.markedRequests.pipe(
    switchMap(fullRequests => this.reload.pipe(
      filter(() => _.isEqual(
        this.form.value.update,
        this.updateFormState.update,
      ) && !_.isEqual(
        this.form.value.filter,
        this.updateFormState.filter,
      )),
      tap(() => void this.loading.openLoader(
        'Загружаем заявки. Осталось еще немного.',
      )),
      startWith(null),
      map(() => fullRequests),
    )),
    map(fullRequests => fullRequests.filter(request => {
      const address = this.form.value.filter?.address?.toLowerCase().trim()
        ?? '';
      return request.address.full.toLowerCase().includes(address);
    })),
    map(fullRequests => fullRequests.filter(request => {
      const urgency = this.form.value.filter?.urgency as SelectOption[] | null;
      if (!urgency) { return request; }
      return request.urgency.ru === urgency.at(0)?.value;
    })),
    map(fullRequests => fullRequests.filter(request => {
      const cases = this.form.value.filter?.anomalyCases;
      if (!cases?.length) { return request; }
      for (const anomalyCase of cases) {
        if (request.anomaly.cases.includes(anomalyCase.value)) {
          return true;
        }
      }
      return false;
    })),
    tap(() => {
      this.updateFormState.filter = this.form.value.filter as FilterForm;
    }),
  );

  private readonly sortedRequests = this.filteredRequests.pipe(
    switchMap(fullRequests => this.form.controls.sort.valueChanges.pipe(
      startWith(this.form.controls.sort.value),
      map(sortForm => {
        if (!sortForm || (!sortForm.group && !sortForm.sort)) {
          return fullRequests;
        }
        if (!sortForm.group) {
          // eslint-disable-next-line
          return sortRequests(fullRequests, sortForm.sort!);
        }

        const grouped = groupRequests(fullRequests, sortForm.group);
        if (!sortForm.sort) {
          return grouped.flat();
        }
        const groupedNSorted = [];
        for (const group of grouped) {
          groupedNSorted.push(sortRequests(group, sortForm.sort));
        }
        return groupedNSorted.flat();
      }),
    )),
  );

  public readonly requests = this.sortedRequests.pipe(
    shareReplay(1),
  );

  // #endregion


  // #region Analytics

  public readonly requestsCount = this.requests.pipe(
    map(requests => requests.length),
  );

  public readonly anomalyRequestsCount = this.requests.pipe(
    map(requests => requests.filter(
      request => request.anomaly.exists,
    )),
    map(requests => requests.length),
  );

  public readonly anomalyPercentage = zip([
    this.requestsCount,
    this.anomalyRequestsCount,
  ]).pipe(
    map(([requestsCount, anomaliesCount]) => (anomaliesCount / requestsCount)),
  );

  // #endregion

}
