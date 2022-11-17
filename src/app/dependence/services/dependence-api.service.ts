import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ErrorResponse } from 'src/app/core/models/error-response';
import { GetManyResponse } from 'src/app/core/models/get-many-response';
import { clearHttpParams } from 'src/app/shared/utils/clear-http-params';
import { environment } from 'src/environments/environment';
import { DependencePlotQuery, toBackendDependecePlotQuery } from '../models/dependence-api';


@Injectable({
  providedIn: 'root',
})
export class DependenceApiService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public getDispatchers(): Observable<string[]> {
    const url = `/${environment.api.prefix}/dispatchers`;
    return this.http.get<GetManyResponse & {
      dispatcher: string[];
    }>(url).pipe(
      map(response => response.dispatcher),
    );
  }

  public getPlot(
    query: DependencePlotQuery,
  ): Observable<string> {
    const url = `/${environment.api.prefix}/dashboard/plots/efficiency`;

    return this.http.get<ErrorResponse & { filename: string }>(url, {
      params: new HttpParams({
        fromObject: clearHttpParams({
          ...toBackendDependecePlotQuery(query),
        }),
      }),
    }).pipe(
      map(response => response.filename),
    );
  }

}
