import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { GetManyResponse } from 'src/app/core/models/get-many-response';
import { environment } from 'src/environments/environment';
import { AnomalySuspect, BackendAnomalySuspect, fromBackendAnomalySuspect } from '../models/anomaly-suspect';


@Injectable({
  providedIn: 'root',
})
export class AnomalyApiService {

  constructor(
    private readonly http: HttpClient,
  ) { }


  // #region Suspects

  /**
   * Amount is limited by max batch size
   * Do not send over BATCH_SIZE ids
   */
  private getSuspectsBatch(
    ids: string[],
    anomalyCases: number[] = [],
  ): Observable<AnomalySuspect[]> {
    const url = `/${environment.api.prefix}/anomalies`;

    return this.http.get<GetManyResponse & {
      requests_anomalies: BackendAnomalySuspect[];
    }>(url, {
      params: {
        // eslint-disable-next-line camelcase
        root_ids: ids.join(','),
        // eslint-disable-next-line camelcase
        anomaly_cases: anomalyCases,
      },
    }).pipe(
      map(response => response.requests_anomalies),
      map(backendSuspects => backendSuspects.map(
        suspect => fromBackendAnomalySuspect(suspect),
      )),
    );
  }

  public getSuspects(
    ids: string[],
  ): Observable<AnomalySuspect[]> {
    const batchCount = Math.ceil(ids.length / environment.api.batchSize);
    const batches = Array.from({ length: batchCount }, () => null).map(
      (_, index) => ids.slice(
        index * environment.api.batchSize,
        index * environment.api.batchSize + environment.api.batchSize,
      ),
    );
    return forkJoin(batches.map(batch => this.getSuspectsBatch(batch))).pipe(
      map(responses => responses.flat()),
    );
  }

  // #endregion

  public mark(
    id: string,
    isAnomaly: boolean,
  ): Observable<GetManyResponse> {
    const url = `/${environment.api.prefix}/custom_requests_anomalies`;

    return this.http.post<GetManyResponse>(url, {
      // eslint-disable-next-line camelcase
      is_anomaly: isAnomaly,
      // eslint-disable-next-line camelcase
      root_id: id,
    });
  }

}
