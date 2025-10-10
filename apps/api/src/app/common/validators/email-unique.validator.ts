import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserRepository } from '../../repositories/user';

// common/validators/email-unique.validator.ts
@ValidatorConstraint({ name: 'EmailUnique', async: true })
@Injectable()
export class EmailUniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(email: string): Promise<boolean> {
    if (!email) return true;
    const result = await this.userRepository.emailExists(email);
    return !result;
  }

  defaultMessage(): string {
    return 'El correo electrónico ya está registrado';
  }
}