import { WORKOUT_TYPES, WorkoutType } from "@app/schemas/workouts";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested } from "class-validator";

 class WeightDto {
  @IsNumber()
  @Min(1)
  men!: number;

  @IsNumber()
  @Min(1)
  women!: number;
 }


export class WorkoutContentExerciseDto {
  @IsString()
  @MaxLength(500)
  public readonly description!: string;

  @ValidateNested()
  @Type(() => WeightDto)
  @IsOptional()
  public readonly weight?: WeightDto;

  @IsString()
  @IsOptional()
  public readonly notes?: string;
}

export class WorkoutContentDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  public readonly header?: string;

  @ValidateNested({ each: true })
  @Type(() => WorkoutContentExerciseDto)
  @IsOptional()
  public readonly exercise?: WorkoutContentExerciseDto[];
  
  @IsString()
  @IsOptional()
  public readonly videoUrl?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  public readonly notes?: string;
}


export class CreateWorkoutDto {
  @IsString()
  @MaxLength(100)
  public readonly name!: string;
  
  @IsIn(WORKOUT_TYPES)
  public readonly type!: WorkoutType;


  @IsOptional()
  public readonly timeCap?: unknown; // in seconds

  @IsNumber()
  @IsOptional()
  public readonly difficulty!: number;

  @IsIn(['desc', 'asc'])
  public readonly scoreOrder!: 'asc' | 'desc';

  @IsString({ each: true })
  @IsOptional()
  public readonly disciplines?: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  public readonly description?: string;


  @ValidateNested()
  @Type(() => WorkoutContentDto)
  public readonly content!: WorkoutContentDto;
}
