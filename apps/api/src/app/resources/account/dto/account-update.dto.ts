import { ApiUpdateAccountRequestBody } from '@app/api-types/account';
import { ATHLETE_CATEGORIES, AthleteCategory } from '@app/schemas/common';
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateAccountDto implements ApiUpdateAccountRequestBody {
  @IsString()
  @MaxLength(40)
  @IsOptional()
  @IsNotEmpty()
  username?: string | undefined;

  @IsString()
  @MaxLength(40)
  @IsOptional()
  @IsNotEmpty()
  alias?: string | null | undefined;
  @IsString()
  @MaxLength(40)
  @IsOptional()
  @IsNotEmpty()
  cellphone?: string | undefined;
  
  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  @IsNotEmpty()
  email?: string | undefined;
  
  @IsString()
  @MaxLength(20)
  @IsOptional()
  @IsNotEmpty()
  firstName?: string | undefined;
  
  @IsString()
  @MaxLength(20)
  @IsOptional()
  @IsNotEmpty()
  lastName?: string | undefined;
  
  @IsNumber()
  @IsOptional()
  height?: number | undefined;

  @IsNumber()
  @IsOptional()
  weight?: number | undefined

  @IsUUID()
  @IsOptional()
  @IsNotEmpty()
  locationId?: string | undefined;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nationality?: string | undefined;

  @IsIn(ATHLETE_CATEGORIES)
  @IsOptional()
  category?: AthleteCategory;
}
