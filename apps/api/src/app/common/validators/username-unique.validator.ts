import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { DatabaseService } from '../../database/database.service';
import { Injectable } from '@nestjs/common';

// common/validators/username-unique.validator.ts
@ValidatorConstraint({ name: 'UsernameUnique', async: true })
@Injectable()
export class UsernameUniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(username: string): Promise<boolean> {
    if (!username) return true;
    
    const result = await this.databaseService.query(
      'SELECT 1 FROM users WHERE LOWER(username) = LOWER($1) LIMIT 1',
      [username]
    );
    return result.rows.length === 0; // true si NO existe
  }

  defaultMessage(): string {
    return 'El nombre de usuario ya está en uso';
  }
}