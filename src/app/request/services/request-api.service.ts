import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { GetManyResponse } from 'src/app/core/models/get-many-response';
import { clearHttpParams } from 'src/app/shared/utils/clear-http-params';
import { environment } from 'src/environments/environment';
import { BackendRequest, fromBackendRequest, Request } from '../models/request';
import { BackendRequestLocation, BaseRequestLocationsQuery, fromBackendRequestLocation, RequestLocation, RequestLocationsQuery, toBackendRequestLocationQuery, toBaseBackendRequestLocationQuery } from '../models/request-location';


@Injectable({
  providedIn: 'root',
})
export class RequestApiService {

  constructor(
    private readonly http: HttpClient,
  ) { }


  // #region Locations

  /**
   * Amount is limited by max batch size
   * Do not request over BATCH_SIZE limit
   */
  private getLocationBatch(
    query: RequestLocationsQuery,
  ): Observable<RequestLocation[]> {
    const url = `/${environment.api.prefix}/points`;

    return this.http.get<GetManyResponse & {
      points: BackendRequestLocation[];
    }>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendRequestLocationQuery(query),
        }),
      }),
    }).pipe(
      map(response => response.points),
      map(backendLocations => backendLocations.map(
        location => fromBackendRequestLocation(location),
      )),
    );
  }

  private getLocationCount(
    query: BaseRequestLocationsQuery,
  ): Observable<number> {
    const url = `/${environment.api.prefix}/points/count`;

    return this.http.get<GetManyResponse>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBaseBackendRequestLocationQuery(query),
        }),
      }),
    }).pipe(
      map(response => response.count),
    );
  }

  public getLocations(
    query: BaseRequestLocationsQuery,
  ): Observable<RequestLocation[]> {
    return this.getLocationCount(query).pipe(
      map(count => Array.from({
        length: Math.ceil(count / environment.api.batchSize),
      }, () => null)),
      map(array => array.map((_, index) => index * environment.api.batchSize)),
      switchMap(offsets => offsets.length ? forkJoin(
        offsets.map(offset => this.getLocationBatch({
          ...query,
          offset,
          limit: environment.api.batchSize,
        })),
      ) : of([])),
      map(responses => responses.flat()),
    );
  }

  // #endregion


  // #region Requests

  /**
   * Amount is limited by max batch size
   * Do not send over BATCH_SIZE ids
   */
  private getRequestBatch(ids: string[]): Observable<Request[]> {
    const url = `/${environment.api.prefix}/requests`;

    return this.http.get<GetManyResponse & { requests: BackendRequest[] }>(
      url, {
        // eslint-disable-next-line camelcase
        params: { root_ids: ids.join(',') },
      },
    ).pipe(
      map(response => response.requests),
      map(backendRequests => backendRequests.map(
        request => fromBackendRequest(request),
      )),
    );
  }

  public getRequests(ids: string[]): Observable<Request[]> {
    const batchCount = Math.ceil(ids.length / environment.api.batchSize);
    const batches = Array.from({ length: batchCount }, () => null).map(
      (_, index) => ids.slice(
        index * environment.api.batchSize,
        index * environment.api.batchSize + environment.api.batchSize,
      ),
    );
    return forkJoin(batches.map(batch => this.getRequestBatch(batch))).pipe(
      map(responses => responses.flat()),
    );
  }

  // #endregion

}
