import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DatabaseService } from '../../database/database.service';


@ValidatorConstraint({ name: 'CityExists', async: true })
@Injectable()
export class CityExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(cityId: string): Promise<boolean> {
    if (!cityId) return true; // Si es opcional, deja que @IsOptional lo maneje
    
    try {
      const result = await this.databaseService.query(
        'SELECT 1 FROM geo_cities WHERE id = $1 LIMIT 1',
        [cityId]
      );
      return result.rows.length > 0;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `La ciudad con el ID ${args.value} no existe`;
  }
}