import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { GeoRepository } from '../../repositories/geo/geo.repository';


@ValidatorConstraint({ name: 'CountryExists', async: true })
@Injectable()
export class CountryExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly _geoRepository: GeoRepository) {}

  async validate(countryId: string): Promise<boolean> {
    if (typeof countryId !== 'string') return true; // Si es opcional, deja que @IsOptional lo maneje

    try {
      const result = await this._geoRepository.existsCountry(countryId);
      return result;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `La país con el código ${args.value} no existe`;
  }
}