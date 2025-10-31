import { Injectable } from '@nestjs/common';
import { GeoRepository } from '../repositories/geo';

@Injectable()
export class GeoService {
  constructor(private readonly _geoRepository: GeoRepository) {}

  public async getCountries() {
    const countries = await this._geoRepository.getCountries();
    return {
      data: countries
    }
  }

  public async getAdministrativeLevels(country: string) {
    const levels = await this._geoRepository.getAdministrativeLevels(country.toUpperCase());
    return {
      data: levels
    }
  }

  public async administrativeDivisions(countryCode: string, levelId: string) {
    const result = await this._geoRepository.getAdministrativeDivisions(countryCode, levelId);
    return {
      data: result,
    };
  }

  public async getDivisions(countryCode: string, levelId?: string, parentId?: string) {
    const result = await this._geoRepository.getAdministrativeDivisions(countryCode, levelId, parentId);
    return {
      data: result,
    };
  }

  // public async childrenOfDivision(id: string) {
  //   const result = await this._geoRepository.getChildDivisions(id);
  //   return {
  //     data: result,
  //   };
  // }

  // public async getAdministrativeDivisions(countryCode: string) {
  //   const divisions = await this._geoRepository.getAdministrativeDivisionsByCountryCode(countryCode);
  //   return {
  //     data: divisions,
  //   }
  // }
}
