import { Transform, Type } from 'class-transformer';
import { IsOptional, IsBoolean, IsNumber, Min, IsIn } from 'class-validator';
import { AthleteCategory, JudgeLevel, ATHLETE_CATEGORIES, JUDGE_LEVELS } from '@app/schemas/types';

export class GetAccountsQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  isCoach?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  isJudge?: boolean;

  @IsOptional()
  @IsIn(JUDGE_LEVELS)
  judgeLevel?: JudgeLevel;

  @IsOptional()
  @IsIn(ATHLETE_CATEGORIES)
  category?: AthleteCategory;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}