import { Controller, Get, Param, Query } from '@nestjs/common';
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
  @Get('countries/:code/levels')
  public async getAdministrativeLevelsByCountryCode(@Param('code') code: string) {
    return this.geoService.getAdministrativeLevels(code)
  }

  @Public()
  @Get('countries/:code/divisions')
  public async getAdministrativeDivisionsByCountryCode(@Param('code') countryCode: string, @Query() query: { level?: string; parent?: string; }) {
    return this.geoService.getDivisions(countryCode, query.level, query.parent);
  }
}
