import { ApiAccountUpdateBody } from '@app/schemas/api/account';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { CityExists } from '../../../common/decorators';

export class UpdateAccountDto implements ApiAccountUpdateBody {
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
  @CityExists({ message: 'La ciudad con el ID $value no existe' })
  cityId?: string | undefined;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nationality?: string | undefined;
}
