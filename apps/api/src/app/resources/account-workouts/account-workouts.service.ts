import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkoutRepository } from '../../repositories/workouts';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { Session } from '../../auth';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class AccountWorkoutsService {

  constructor(
    private readonly _workoutRepository: WorkoutRepository,
  ) {}

  async getAll(session: Session) {
    const workouts = await this._workoutRepository.getAll({
      userId: session.id,
    });
    return {
      data: workouts,
    };
  }

  async get(id: string, session: Session) {
    const workout = await this._workoutRepository.get(id);
    if (!workout) {
      throw new NotFoundException('Workout no encontrado');
    }

    if (!workout.authors.find(author => author.id === session.id)) {
      throw new ForbiddenException('No tienes permiso para ver este workout');
    }

    return {
      data: workout,
    };
  }

  async create(data: CreateWorkoutDto, session: Session) {
    if (!await this._workoutRepository.isNameUnique(data.name)) {
      throw new ForbiddenException('El nombre del workout ya está en uso');
    }
    const workout = await this._workoutRepository.create({ ...data, userId: session.id });
    return {
      data: workout,
    };
  }
  
  async update(id: string, update: UpdateWorkoutDto, session: Session) {
    const workout = await this._workoutRepository.get(id);
    if (!workout) {
      throw new NotFoundException('Workout no encontrado');
    }

    if (!workout.authors.find(author => author.id === session.id)) {
      throw new ForbiddenException('No tienes permiso para editar este workout');
    }

    if (!workout.editable){
      throw new ForbiddenException('Este workout no se puede eliminar debido a que ya tienes registros asociados');
    }

    if (update.name && update.name !== workout.name) {
      if (!await this._workoutRepository.isNameUnique(update.name, id)) {
        throw new ForbiddenException('El nombre del workout ya está en uso');
      }
    }

    return {
      data: workout,
    };
  }

  async remove(id: string, session: Session) {
    const workout = await this._workoutRepository.get(id);
    if (!workout) {
      throw new NotFoundException('Workout no encontrado');
    }

    if (!workout.authors.find(author => author.id === session.id)) {
      throw new ForbiddenException('No tienes permiso para eliminar este workout');
    }

    if (!workout.editable){
      throw new ForbiddenException('Este workout no se puede eliminar debido a que ya tienes registros asociados');
    }

    return await this._workoutRepository.delete(id);
  }

  public async publish(id: string, session: Session) {
    const workout = await this._workoutRepository.get(id);
    if (!workout) {
      throw new NotFoundException('Workout no encontrado');
    }

    if (!workout.authors.find(author => author.id === session.id)) {
      throw new ForbiddenException('No tienes permiso para publicar este workout');
    }

    if ((workout.content.exercise?.length || 0) > 0) {
      throw new ForbiddenException('No se puede publicar un workout sin contenido');
    }

    await this._workoutRepository.update(id, { status: 'published' });
  }
}
