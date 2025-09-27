import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DatabaseService } from '../../database/database.service';

// common/validators/email-unique.validator.ts
@ValidatorConstraint({ name: 'EmailUnique', async: true })
@Injectable()
export class EmailUniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(email: string): Promise<boolean> {
    if (!email) return true;
    
    const result = await this.databaseService.query(
      'SELECT 1 FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
      [email]
    );
    return result.rows.length === 0;
  }

  defaultMessage(): string {
    return 'El correo electrónico ya está registrado';
  }
}