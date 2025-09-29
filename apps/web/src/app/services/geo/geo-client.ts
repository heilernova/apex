import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GeoCountry, GeoState } from './geo-data';

@Injectable({
  providedIn: 'root'
})
export class GeoClient {
  private readonly _http = inject(HttpClient);

  public getCountries() {
    return this._http.get<{ data: GeoCountry[] }>('/geo/countries');
  }

  public getStates(countryCode: string) {
    return this._http.get<{ data: GeoState[] }>(`/geo/countries/${countryCode}/states`);
  }
  
}
