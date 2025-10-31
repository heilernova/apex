
import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, IsUUID, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { USER_GENDERS, UserGender } from '@app/schemas/users';
import { ATHLETE_CATEGORIES, AthleteCategory } from '@app/schemas/common';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(100)
  @IsNotEmpty()
  public readonly email!: string;
  
  @IsString()
  @Matches(/^[a-zA-Z0-9_.-]*$/)
  @MaxLength(40)
  @IsNotEmpty()
  public readonly username!: string;

  @Matches(/^\+\d+ \d{3} \d{3} \d{4}$/)
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

  @IsDateString()
  public readonly birthdate!: string; // ISO 8601 date string

  @IsNumber()
  @Min(30)
  public readonly height!: number; // in cm
  
  @IsNumber()
  @Min(10)
  public readonly weight!: number; // in kg

  @IsUUID()
  public readonly locationId!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: 'El código de país debe ser un código ISO alpha-2 válido (2 letras mayúsculas)' })
  public readonly nationality!: string; // ISO alpha-2 country code

  @IsIn(ATHLETE_CATEGORIES)
  public readonly category!: AthleteCategory;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  public readonly password!: string;
}
