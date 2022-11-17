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
import { isNotNil } from 'src/app/shared/utils/is-not-nil';
import { Urgency } from '../models/urgency';


interface BackendFilterForm {
  datetimeRange: ValueRange<Date> | null;
  region: SelectOption<string>[] | null;
  services: SelectOption<string>[];
  efficiencies: SelectOption<string>[];
  grades: SelectOption<string>[];
  urgencies: SelectOption<Urgency>[];
  works: SelectOption<string>[];
  deffects: SelectOption<string>[];
  owners: SelectOption<string>[];
}

interface FrontendFilterForm {
  address: string;
  anomalyCases: SelectOption<number>[];
}

interface FilterForm {
  backend?: BackendFilterForm;
  frontend?: FrontendFilterForm;
}

@Injectable({
  providedIn: 'root',
})
export class RequestsDataService {

  constructor(
    private readonly anomalyApi: AnomalyApiService,
    private readonly fb: FormBuilder,
    private readonly requestApi: RequestApiService,
    private readonly loading: LoadingService,
  ) { }


  // #region Inputs

  public readonly form = this.fb.group({
    backendFilters: this.fb.group({
      datetimeRange: [null as ValueRange<Date> | null, [Validators.required]],
      region: [null as SelectOption<string>[] | null, [Validators.required]],
      services: [[] as SelectOption<string>[]],
      efficiencies: [[] as SelectOption<string>[]],
      grades: [[] as SelectOption<string>[]],
      urgencies: [[] as SelectOption<Urgency>[]],
      works: [[] as SelectOption<string>[]],
      deffects: [[] as SelectOption<string>[]],
      owners: [[] as SelectOption<string>[]],
    }),
    frontendFilters: this.fb.group({
      address: [''],
      anomalyCases: [[] as SelectOption<number>[]],
    }),
    anomalyOnlyFilter: [false],
    sort: [{
      group: null as RequestGroupOption | null,
      sort: RequestSortOption.CloseDateDescending as RequestSortOption | null,
    }],
  });

  /**
   * Form state when updates were loaded.
   */
  public updateFormState: FilterForm = {};

  public clearFormState(): void {
    this.updateFormState = {};
  }

  public readonly reload = new EventEmitter<void>();

  public get region(): string | null {
    const regionValue = this.form.value.backendFilters?.region;
    if (!regionValue) { return null; }
    const regionOption = regionValue.at(0) as SelectOption<string> | null;
    if (!regionOption) { return null; }
    return regionOption.value;
  }

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
      this.form.value.backendFilters,
      this.updateFormState.backend,
    )),
    tap(() => void this.loading.openLoader(
      'Загружаем заявки. Осталось еще немного.',
    )),
    map(() => this.form.value.backendFilters),
    filter(isNotNil),
    switchMap(filters => this.getFullRequests({
      /* eslint-disable */
      region: this.region!,
      datetimeRange: filters.datetimeRange!,
      /* eslint-enable */
      service: filters.services?.map(option => option.value) ?? undefined,
      efficiency: filters.efficiencies?.map(option => option.value)
        ?? undefined,
      grade: filters.grades?.map(option => option.value) ?? undefined,
      urgency: filters.urgencies?.map(option => option.value) ?? undefined,
      work: filters.works?.map(option => option.value) ?? undefined,
      deffect: filters.deffects?.map(option => option.value) ?? undefined,
      owner: filters.owners?.map(option => option.value) ?? undefined,
    })),
    tap(() => {
      this.updateFormState.backend =
        this.form.value.backendFilters as BackendFilterForm;
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
        this.form.value.backendFilters,
        this.updateFormState.backend,
      ) && !_.isEqual(
        this.form.value.frontendFilters,
        this.updateFormState.frontend,
      )),
      tap(() => void this.loading.openLoader(
        'Загружаем заявки. Осталось еще немного.',
      )),
      startWith(null),
      map(() => fullRequests),
    )),
    map(fullRequests => fullRequests.filter(request => {
      const address =
        this.form.value.frontendFilters?.address?.toLowerCase().trim()
        ?? '';
      return request.address.full.toLowerCase().includes(address);
    })),
    map(fullRequests => fullRequests.filter(request => {
      const cases = this.form.value.frontendFilters?.anomalyCases;
      if (!cases?.length) { return request; }
      for (const anomalyCase of cases) {
        if (request.anomaly.cases.includes(anomalyCase.value)) {
          return true;
        }
      }
      return false;
    })),
    tap(() => {
      this.updateFormState.frontend =
        this.form.value.frontendFilters as FrontendFilterForm;
    }),
  );

  private readonly anomalyFilteredRequests = this.filteredRequests.pipe(
    switchMap(
      fullRequests => this.form.controls.anomalyOnlyFilter.valueChanges.pipe(
        startWith(this.form.controls.anomalyOnlyFilter.value),
        map(anomalyOnly => fullRequests.filter(request => {
          if (!anomalyOnly) { return true; }
          return request.anomaly.exists;
        })),
      ),
    ),
  );

  private readonly sortedRequests = this.anomalyFilteredRequests.pipe(
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
