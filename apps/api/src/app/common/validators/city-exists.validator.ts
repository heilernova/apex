import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DatabaseService } from '../../database/database.service';
import { GeoRepository } from '../../repositories/geo/geo.repository';


@ValidatorConstraint({ name: 'CityExists', async: true })
@Injectable()
export class CityExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly databaseService: DatabaseService, private readonly _geoRepository: GeoRepository) {}

  async validate(cityId: string): Promise<boolean> {
    if (!cityId) return true; // Si es opcional, deja que @IsOptional lo maneje
    
    try {
      const result = await this._geoRepository.existsDivision(cityId);
      return !!result;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `La ciudad con el ID ${args.value} no existe`;
  }
}