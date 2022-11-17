import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ErrorResponse } from 'src/app/core/models/error-response';
import { GetManyResponse } from 'src/app/core/models/get-many-response';
import { clearHttpParams } from 'src/app/shared/utils/clear-http-params';
import { environment } from 'src/environments/environment';
import { AnomalyAnalytics, BackendAnomalyAnalytics, fromBackendAnomalyAnalytics } from '../models/anomaly-analytics';
import { AnomalyCaseChartElement, BackendAnomalyCaseChartElement, fromBackendAnomalyCaseChartData } from '../models/anomaly-case-chart';
import { AnomalyDynamicsChartElement, BackendAnomalyDynamicsChartElement, fromBackendAnomalyDynamicsChartData } from '../models/anomaly-dynamics-chart';
import { DashboardQuery, toBackendDashboardQuery } from '../models/dashboard-api';
import { BackendDeffectRatingElement, DeffectRatingElement, fromBackendDeffectRatingData } from '../models/deffect-rating';
import { BackendOwnerRatingElement, fromBackendOwnerRatingData, OwnerRatingElement } from '../models/owner-rating';
import { BackendServiceRatingElement, fromBackendServiceRatingData, ServiceRatingElement } from '../models/service-rating';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public getAnomalyAnalytics(
    query: DashboardQuery,
  ): Observable<AnomalyAnalytics> {
    const url = `/${environment.api.prefix}/dashboard/anomalies/count`;

    return this.http.get<ErrorResponse & BackendAnomalyAnalytics>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendDashboardQuery(query),
        }),
      }),
    }).pipe(
      map(analytics => fromBackendAnomalyAnalytics(analytics)),
    );
  }

  public getAnomalyCaseChartData(
    query: DashboardQuery,
  ): Observable<AnomalyCaseChartElement[]> {
    const url = `/${environment.api.prefix}/dashboard/anomalies/count_groupped`;

    return this.http.get<ErrorResponse & {
      groups_counts: BackendAnomalyCaseChartElement[];
    }>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendDashboardQuery(query),
        }),
      }),
    }).pipe(
      map(response => fromBackendAnomalyCaseChartData(response.groups_counts)),
    );
  }

  public getAnomalyDynamicsChartData(
    query: DashboardQuery,
  ): Observable<AnomalyDynamicsChartElement[]> {
    const url =
      `/${environment.api.prefix}/dashboard/anomalies/amount_dynamics`;

    return this.http.get<GetManyResponse & {
      dynamics: BackendAnomalyDynamicsChartElement[];
    }>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendDashboardQuery(query),
        }),
      }),
    }).pipe(
      map(response => fromBackendAnomalyDynamicsChartData(response.dynamics)),
    );
  }

  public getServiceRating(
    query: DashboardQuery,
  ): Observable<ServiceRatingElement[]> {
    const url = `/${environment.api.prefix}/dashboard/anomalies/ratings/`
    + 'serving_companies';

    return this.http.get<GetManyResponse & {
      serving_companies: BackendServiceRatingElement[];
    }>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendDashboardQuery(query),
        }),
      }),
    }).pipe(
      map(response => fromBackendServiceRatingData(response.serving_companies)),
    );
  }

  public getOwnerRating(
    query: DashboardQuery,
  ): Observable<OwnerRatingElement[]> {
    const url =
      `/${environment.api.prefix}/dashboard/anomalies/ratings/owner_companies`;

    return this.http.get<GetManyResponse & {
      owner_companies: BackendOwnerRatingElement[];
    }>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendDashboardQuery(query),
        }),
      }),
    }).pipe(
      map(response => fromBackendOwnerRatingData(response.owner_companies)),
    );
  }

  public getDeffectRating(
    query: DashboardQuery,
  ): Observable<DeffectRatingElement[]> {
    const url = `/${environment.api.prefix}/dashboard/anomalies/ratings/`
    + 'deffect_categories';

    return this.http.get<GetManyResponse & {
      deffect_categories: BackendDeffectRatingElement[];
    }>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendDashboardQuery(query),
        }),
      }),
    }).pipe(
      map(response => fromBackendDeffectRatingData(
        response.deffect_categories,
      )),
    );
  }

}
