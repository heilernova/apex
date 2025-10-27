import { IsString, MaxLength } from 'class-validator';
export class LoginDto {
  @IsString()
  @MaxLength(254)
  public readonly username!: string;
  
  @IsString()
  @MaxLength(50)
  public readonly password!: string;
}
