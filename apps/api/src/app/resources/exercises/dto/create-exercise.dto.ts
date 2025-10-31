import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

export class Name {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  public readonly es!: string;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  public readonly en!: string;
}

export class CreateExerciseDto {

  @ValidateNested()
  @Type(() => Name)
  public readonly name!: Name;
  
  @IsIn(['time', 'reps', 'weight'], { each: true })
  public readonly allowedRmTypes!: ('time' | 'reps' | 'weight')[];

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  @IsOptional()
  public readonly description?: string | null | undefined;

  @IsString({ each: true })
  @MaxLength(30, { each: true })
  @IsOptional()
  public readonly tags?: string[] | undefined;

  @IsString({ each: true })
  @MaxLength(30, { each: true })
  @IsOptional()
  public readonly muscleGroups?: string[] | undefined;
}
