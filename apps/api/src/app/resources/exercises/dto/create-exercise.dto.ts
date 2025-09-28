import { ApiExerciseUpdateBody } from '@app/schemas/api/exercises';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
export class CreateExerciseDto implements ApiExerciseUpdateBody {

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsIn(['time', 'reps', 'weight'], { each: true })
  @IsOptional()
  allowedRmTypes?: ('time' | 'reps' | 'weight')[] | undefined;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  @IsOptional()
  description?: string | null | undefined;

  @IsString({ each: true })
  @MaxLength(30, { each: true })
  @IsOptional()
  tags?: string[] | undefined;

  @IsString({ each: true })
  @MaxLength(30, { each: true })
  @IsOptional()
  primaryMuscleGroups?: string[] | undefined;

  @IsOptional()
  videos?: { url: string; platform: string; }[] | undefined;

  @IsString()
  @MaxLength(70)
  @IsOptional()
  seoTitle?: string | null | undefined;

  @IsString()
  @MaxLength(160)
  @IsOptional()
  seoDescription?: string | null | undefined;

  @IsString({ each: true })
  @MaxLength(20, { each: true })
  @IsOptional()
  seoKeywords?: string[] | undefined;
}
