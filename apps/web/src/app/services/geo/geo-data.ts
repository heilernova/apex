import { inject, Injectable } from '@angular/core';
import { GeoClient } from './geo-client';
import { GeoCountry } from './country';
import { IGeoCountryLevel, IGeoCountryDivision } from './geo.types';

@Injectable({
  providedIn: 'root'
})
export class GeoData {
  private readonly _geoClient = inject(GeoClient);
  private readonly _countries: GeoCountry[] = [];

  public getCountries(): Promise<GeoCountry[]> {
    return new Promise<GeoCountry[]>((resolve, reject) => {
      if (this._countries.length === 0) {
        this._geoClient.getCountries().subscribe({
          next: (response) => {
            this._countries.push(...response.map(c => new GeoCountry(c)));
            resolve(this._countries);
          },
          error: (error) => {
            console.error('Error fetching countries:', error);
            reject(error);
          }
        })
      } else {
        resolve(this._countries);
      }
    });
  }

  public getCountryLevels(countryCode: string): Promise<IGeoCountryLevel[]> {
    return new Promise(( resolve, reject) => {
      this._geoClient.getCountryLevels(countryCode).subscribe({
        next: res => {
          resolve(res);
        },
        error: (error) => {
          console.error('Error fetching country levels:', error);
          reject(error);
        }
      })
    });
  }

  public getCountryDivisions(levelId: string): Promise<IGeoCountryDivision[]> {
    return new Promise(( resolve, reject) => {
      this._geoClient.getAdministrativeDivisions(levelId).subscribe({
        next: res => {
          resolve(res);
        },
        error: (error) => {
          reject(error);
        }
      })
    });
  }

}
