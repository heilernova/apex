import { registerDecorator, ValidationOptions } from 'class-validator';
import { CityExistsValidator } from '../validators/city-exists.validator';

export function CityExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CityExistsValidator,
    });
  };
}