import { ApiAuthRegisterBody } from '@app/schemas/api/auth';
import { USER_GENDERS, UserGender } from '@app/schemas/types/user.types';
import { IsDate, IsEmail, IsIn, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsUUID, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { CityExists, CountryExists, IsEmailUnique, IsUsernameUnique } from '../../../common/decorators';
import { Transform } from 'class-transformer';

export class RegisterDto implements Omit<ApiAuthRegisterBody, 'birthdate'> {
  @IsEmail()
  @IsEmailUnique({ message: 'El correo electrónico $value ya está en uso' })
  public readonly email!: string;
  
  @IsString()
  @Matches(/^[a-zA-Z0-9_.-]*$/)
  @MaxLength(40)
  @IsNotEmpty()
  @IsUsernameUnique({ message: 'El nombre de usuario $value ya está en uso' })
  public readonly username!: string;

  @IsPhoneNumber()
  public readonly cellphone!: string;


  @IsString()
  @MaxLength(40)
  public readonly alias?: string | null;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  public readonly firstName!: string;

  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  public readonly lastName!: string;

  @IsIn(USER_GENDERS)
  public readonly gender!: UserGender;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  public readonly birthdate!: Date; // ISO 8601 date string

  @IsNumber()
  @Min(30)
  public readonly height!: number; // in cm
  
  @IsNumber()
  @Min(10)
  public readonly weight!: number; // in kg

  @IsUUID()
  @CityExists({ message: 'La ciudad con el ID $value no existe' })
  public readonly cityId!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: 'El código de país debe ser un código ISO alpha-2 válido (2 letras mayúsculas)' })
  @CountryExists({ message: 'El país con el código $value no existe' })
  public readonly nationality!: string; // ISO alpha-2 country code

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  public readonly password!: string;
}