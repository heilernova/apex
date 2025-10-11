import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoClient {
  private readonly _http = inject(HttpClient);

  public getCountries() {
    return this._http.get<{
      code: string;
      name: string;
      phoneCode: string;
      demonym: {
        masculine: string;
        feminine: string;
      };
    }[]>('/geo/countries');
  }

  public getCountryLevels(countryCode: string) {
    return this._http.get<{
      id: string;
      name: string;
      namePlural: string;
      level: number;
    }[]>(`/geo/countries/${countryCode}/administrative-levels`);
  }

  public getAdministrativeDivisions(levelId: string) {
    return this._http.get<{
      id: string;
      countryCode: string;
      levelId: string;
      parentId: string | null;
      code: string;
      name: string;
      isCapital: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }[]>(`/geo/countries/administrative-divisions/${levelId}`);
  }

  public getAdministrativeDivisionByCountry(code: string) {
    return this._http.get<{
      id: string;
      countryCode: string;  
      levelId: string;
      parentId: string | null;
      code: string;
      name: string;
      isCapital: boolean;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }[]>(`/geo/countries/${code}/administrative-divisions`);
  }
  
}
