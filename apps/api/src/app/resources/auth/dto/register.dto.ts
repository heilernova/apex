import { ApiAuthRegisterBody } from '@app/schemas/api/auth';
import { USER_GENDERS, UserGender } from '@app/schemas/types/user.types';
import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, IsUUID, Matches, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterDto implements ApiAuthRegisterBody {
  @IsEmail()
  public readonly email!: string;

  @IsPhoneNumber()
  public readonly cellphone!: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9_.-]*$/)
  @MaxLength(40)
  @IsNotEmpty()
  public readonly username!: string;

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

  @IsDateString()
  public readonly birthdate!: string; // ISO 8601 date string

  @IsNumber()
  @Min(30)
  public readonly height!: number; // in cm
  
  @IsNumber()
  @Min(10)
  public readonly weight!: number; // in kg

  @IsUUID()
  public readonly cityId!: string;

  @IsString()
  public readonly nationality!: string; // ISO alpha-2 country code

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  public readonly password!: string;
}