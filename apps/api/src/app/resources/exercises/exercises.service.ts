import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseRepository } from '../../repositories/exercises';

@Injectable()
export class ExercisesService {

  constructor(
    private readonly _exerciseRepository: ExerciseRepository,
  ) {}
  public async create(createExerciseDto: CreateExerciseDto) {
    const exercise = await this._exerciseRepository.create(createExerciseDto);
    return {
      data: exercise
    }
  }

  async findAll() {
    const exercises = await this._exerciseRepository.getAll();
    return {
      data: exercises
    };
  }

  async findOne(id: string) {
    const exercise = await this._exerciseRepository.get(id);
    if (!exercise) {
      throw new NotFoundException(`El ejercicio con id ${id} no existe`);
    }
    return {
      data: exercise
    };
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    const data = await this._exerciseRepository.update(id, updateExerciseDto);
    if (!data) {
      throw new NotFoundException(`El ejercicio con id ${id} no existe`);
    }
    return {
      data
    };
  }

  async remove(id: string) {
    await this._exerciseRepository.delete(id);
  }
}
