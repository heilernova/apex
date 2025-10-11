import { inject, Injectable } from '@angular/core';
import { GeoClient } from './geo-client';
import { GeoCountry } from './country';
import { IGeoCountryLevel } from './geo.types';

@Injectable({
  providedIn: 'root'
})
export class CountryDataSource {
  private readonly _geoClient = inject(GeoClient);
  private _levels: IGeoCountryLevel[] = []; 

  public load(country: GeoCountry): Promise<void> {
    return new Promise((resolve, reject) => {
      this._geoClient.getCountryLevels(country.code).subscribe({
        next: (levels) => {
          this._levels = levels;
          resolve();
        },
        error: (error) => {
          console.error('Error loading country levels:', error);
          reject(error);
        }
      });
    });
  }
}
