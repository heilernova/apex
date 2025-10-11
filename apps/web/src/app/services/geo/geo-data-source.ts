import { inject, Injectable } from '@angular/core';
import { GeoClient } from './geo-client';
import { IGeoCountry, IGeoCountryDivision, IGeoCountryLevel } from './geo.types';

@Injectable({
  providedIn: 'root'
})
export class GeoDataSource {
  private readonly _geoClient = inject(GeoClient);

  private dataCountries: IGeoCountry[] = [];

  public getCountries(): Promise<IGeoCountry[]> {
    return new Promise<IGeoCountry[]>((resolve, reject) => {
      this._geoClient.getCountries().subscribe({
        next: res => {
          this.dataCountries = res;
          resolve(this.dataCountries);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  public loadCountryData(country: IGeoCountry): Promise<IGeoCountry> {
    return new Promise((resolve, reject) => {
      if (country.data) {
        resolve(country);
      } else {
        const promises = Promise.all([
          new Promise<IGeoCountryLevel[]>((resolve) => {
            this._geoClient.getCountryLevels(country.code).subscribe({
              next: res => {
                resolve(res);
              }
            });
          }),
          new Promise<IGeoCountryDivision[]>((resolve) => {
            this._geoClient.getAdministrativeDivisionByCountry(country.code).subscribe({
              next: res => {
                resolve(res);
              }
            });
          })
        ]);

        promises.then(values => {
          country.data = {
            levels: values[0],
            divisions: values[1]
          };
          resolve(country);
        }).catch(err => {
          reject(err);
        });
      }
    });
  }
}
