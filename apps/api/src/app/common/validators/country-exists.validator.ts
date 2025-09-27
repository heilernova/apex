import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DatabaseService } from '../../database/database.service';


@ValidatorConstraint({ name: 'CountryExists', async: true })
@Injectable()
export class CountryExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(countryId: string): Promise<boolean> {
    if (typeof countryId !== 'string') return true; // Si es opcional, deja que @IsOptional lo maneje

    try {
      const result = await this.databaseService.query(
        'SELECT 1 FROM geo_countries WHERE code = $1 LIMIT 1',
        [countryId]
      );
      return result.rows.length > 0;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `La país con el código ${args.value} no existe`;
  }
}