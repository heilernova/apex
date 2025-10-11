import { Controller, Get, Param } from '@nestjs/common';
import { GeoService } from './geo.service';
import { Public } from '../../auth';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Public()
  @Get('countries')
  public async getCountries() {
    return this.geoService.getCountries();
  }

  @Public()
  @Get('countries/:code/administrative-levels')
  public async getAdministrativeLevelsByCountryCode(@Param('code') code: string) {
    return this.geoService.getAdministrativeLevels(code)
  }

  @Public()
  @Get('countries/:code/administrative-divisions')
  public async getAdministrativeDivisionsByCountryCode(@Param('code') code: string) {
    return this.geoService.getAdministrativeDivisions(code);
  }

  @Public()
  @Get('countries/:code')
  public async getCountryByCode(code: string) {
    const country = await this.geoService.getCountryByCode(code);
    return {
      data: country,
    }
  }

  @Public()
  @Get('countries/administrative-divisions/:id')
  public async getStates(@Param('id') id: string) {
    return this.geoService.administrativeDivisions(id);
  }

  @Public()
  @Get('countries/administrative-divisions/:id/children')
  public async getChildren(@Param('id') id: string) {
    return this.geoService.childrenOfDivision(id);
  }
}
