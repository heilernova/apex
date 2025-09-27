import { registerDecorator, ValidationOptions } from 'class-validator';
import { CountryExistsValidator } from '../validators/country-exists.validator';

export function CountryExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CountryExistsValidator,
    });
  };
}