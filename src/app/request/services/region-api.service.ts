import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GetManyResponse } from 'src/app/core/models/get-many-response';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class RegionApiService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public getMany(): Observable<string[]> {
    const url = `/${environment.api.prefix}/regions`;
    return this.http.get<GetManyResponse & { regions: string[] }>(url).pipe(
      map(response => response.regions),
    );
  }

}
