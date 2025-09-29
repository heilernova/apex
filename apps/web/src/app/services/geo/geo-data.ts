import { inject, Injectable } from '@angular/core';
import { GeoClient } from './geo-client';

@Injectable({
  providedIn: 'root'
})
export class GeoData {
  private readonly _geoClient = inject(GeoClient);
  private readonly _countries: GeoCountry[] = [];
  private readonly _states: GeoState[] = [];

  public getCountries(): Promise<GeoCountry[]> {
    return new Promise<GeoCountry[]>((resolve, reject) => {
      if (this._countries.length === 0) {
        this._geoClient.getCountries().subscribe({
          next: (response) => {
            this._countries.push(...response.data);
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

  public getStates(countryCode: string): Promise<GeoState[]> {
    return new Promise<GeoState[]>((resolve, reject) => {
      if (this._states.length === 0) {
        this._geoClient.getStates(countryCode).subscribe({
          next: (response) => {
            this._states.push(...response.data);
            resolve(this._states);
          },
          error: (error) => {
            console.error('Error fetching states:', error);
            reject(error);
          }
        })
      } else {
        resolve(this._states);
      }
    });
  }
}

export interface GeoCountry {
  name: string;
  code: string;
  phoneCode: string;
  demonym: {
    masculine: string;
    feminine: string;
  };
}

export interface GeoState {
  name: string;
  code: string;
  cities: GeoCity[];
}

export interface GeoCity {
  id: number;
  name: string;
}
