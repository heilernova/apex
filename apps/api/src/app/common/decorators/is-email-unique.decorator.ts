import { registerDecorator, ValidationOptions } from 'class-validator';
import { EmailUniqueValidator } from '../validators/email-unique.validator';

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailUniqueValidator,
    });
  };
}