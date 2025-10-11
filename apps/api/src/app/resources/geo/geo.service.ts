import { Injectable, NotFoundException } from '@nestjs/common';
import { GeoRepository } from '../../repositories/geo/geo.repository';

@Injectable()
export class GeoService {
  constructor(
    private readonly _geoRepository: GeoRepository
  ) {}

  public async getCountries() {
    const countries = await this._geoRepository.getCountries();
    return {
      data: countries,
    }
  }

  public async getAdministrativeLevels(country: string) {
    const levels = await this._geoRepository.getAdministrativeLevels(country);
    return {
      data: levels
    }
  }

  public async getCountryByCode(code: string) {
    const country = await this._geoRepository.getCountryByCode(code);
    if (!country) {
      throw new NotFoundException(`El país con código ${code} no fue encontrado`);
    }
    return {
      data: country,
    }
  }

  public async administrativeDivisions(id: string){
    const result = await this._geoRepository.getAllAdministrationDivisions(id);
    return {
      data: result,
    };
  }

  public async childrenOfDivision(id: string) {
    const result = await this._geoRepository.getChildDivisions(id);
    return {
      data: result,
    };
  }

  public async getAdministrativeDivisions(countryCode: string) {
    const divisions = await this._geoRepository.getAdministrativeDivisionsByCountryCode(countryCode);
    return {
      data: divisions,
    }
  }
}
