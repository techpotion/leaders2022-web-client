import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ErrorResponse } from 'src/app/core/models/error-response';
import { GetManyResponse } from 'src/app/core/models/get-many-response';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class FilterApiService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public getDeffects(): Observable<string[]> {
    const url = `/${environment.api.prefix}/deffect_categories`;
    return this.http.get<GetManyResponse & {
      deffect_categories: string[];
    }>(url).pipe(
      map(response => response.deffect_categories),
    );
  }


  // #region Hoods

  public getHoods(): Observable<string[]> {
    const url = `/${environment.api.prefix}/regions`;
    return this.http.get<GetManyResponse & { regions: string[] }>(url).pipe(
      map(response => response.regions),
    );
  }

  public getHoodArea(hood: string): Observable<GeoJSON.Polygon> {
    const url = `/${environment.api.prefix}/regions/${hood}/area`;
    return this.http.get<ErrorResponse & {
      area_polygon_geojson: string;
    }>(url).pipe(
      map(response => JSON.parse(
        response.area_polygon_geojson,
      ) as GeoJSON.Polygon),
    );
  }

  // #endregion


  public getOwners(): Observable<string[]> {
    const url = `/${environment.api.prefix}/owner_companies`;
    return this.http.get<GetManyResponse & {
      owner_companies: string[];
    }>(url).pipe(
      map(response => response.owner_companies),
    );
  }

  public getServices(): Observable<string[]> {
    const url = `/${environment.api.prefix}/serving_companies`;
    return this.http.get<GetManyResponse & {
      serving_companies: string[];
    }>(url).pipe(
      map(response => response.serving_companies),
    );
  }

  public getWorks(): Observable<string[]> {
    const url = `/${environment.api.prefix}/work_types`;
    return this.http.get<GetManyResponse & { work_types: string[] }>(url).pipe(
      map(response => response.work_types),
    );
  }

}
