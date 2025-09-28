import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ApiExercisesCreateResponse, ApiExercisesGetAllResponse, ApiExercisesUpdateResponse } from '@app/schemas/api/exercises';
import { Public } from '../../auth';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  async create(@Body() createExerciseDto: CreateExerciseDto): Promise<ApiExercisesCreateResponse> {
    const data = await this.exercisesService.create(createExerciseDto);
    return { data };
  }

  @Get()
  @Public()
  async findAll(): Promise<ApiExercisesGetAllResponse> {
    const data = await this.exercisesService.findAll();
    return { data };
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const data = await this.exercisesService.findOne(id);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto
  ): Promise<ApiExercisesUpdateResponse> {
    const data = await this.exercisesService.update(id, updateExerciseDto);
    return { data };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.exercisesService.remove(id);
  }
}
