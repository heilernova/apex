import { IsString, MaxLength } from "class-validator";

export class UpdatePasswordDto {
  
  @IsString()
  @MaxLength(50)
  public readonly currentPassword!: string;
  
  @IsString()
  @MaxLength(50)
  public readonly newPassword!: string;
}
