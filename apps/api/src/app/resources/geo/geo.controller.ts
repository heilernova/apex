import { Controller, Get, Param } from '@nestjs/common';
import { GeoService } from './geo.service';
import { Public } from '../../auth';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Public()
  @Get('countries')
  public async getCountries() {
    const countries = await this.geoService.getCountries();
    return {
      data: countries,
    }
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
  @Get('countries/:code/states')
  public async getStatesByCountryCode(@Param('code') code: string) {
    const states = await this.geoService.getStatesWithCities(code.toUpperCase());
    return {
      data: states,
    }
  }
}
