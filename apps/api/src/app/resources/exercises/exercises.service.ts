import { Injectable, NotFoundException } from '@nestjs/common';
import { generateSlug } from '@app/shared/utils';
import { ApiExercise } from '@app/schemas/api/exercises';
import { DbExercise, DbExerciseInsert, DbExerciseUpdate } from '@app/schemas/db';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly _db: DatabaseService
  ) {}

  mapDbToApi(dbExercise: DbExercise): ApiExercise {
    return {
      id: dbExercise.id,
      name: dbExercise.name,
      slug: dbExercise.slug,
      description: dbExercise.description,
      published: dbExercise.published,
      allowedRmTypes: dbExercise.allowed_rm_types,
      tags: dbExercise.tags,
      primaryMuscleGroups: dbExercise.primary_muscle_groups,
      videos: dbExercise.videos,
      seo: {
        title: dbExercise.seo_title,
        description: dbExercise.seo_description,
        keywords: dbExercise.seo_keywords,
        openGraphImages: dbExercise.seo_open_graph_images,
      },
      images: dbExercise.images || [],
      createdAt: dbExercise.created_at.toISOString(),
      updatedAt: dbExercise.updated_at.toISOString(),
    }
  }


  async create(createExerciseDto: CreateExerciseDto) {
    const values: DbExerciseInsert = {
      name: createExerciseDto.name,
      slug: generateSlug(createExerciseDto.name),
      description: createExerciseDto.description || null,
      published: false,
      allowed_rm_types: createExerciseDto.allowedRmTypes || [],
      tags: createExerciseDto.tags || [],
      primary_muscle_groups: createExerciseDto.primaryMuscleGroups || [],
      videos: createExerciseDto.videos || [],
      seo_title: createExerciseDto.seoTitle || null,
      seo_description: createExerciseDto.seoDescription || null,
      seo_keywords: createExerciseDto.seoKeywords || [],
    }

    const result = await this._db.insert<DbExercise>({
      table: 'exercises',
      data: values,
      returning: '*'
    })
    return this.mapDbToApi(result.rows[0]);
  }

  async findAll() {
    const result = await this._db.query<DbExercise>('SELECT * FROM exercises ORDER BY name DESC');
    return result.rows.map(ex => this.mapDbToApi(ex));
  }

  async findOne(id: string) {
    const result = await this._db.query<DbExercise>('SELECT * FROM exercises WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      throw new NotFoundException({
        message: `No existe un ejercicio con el id ${id}`
      });
    }
    return this.mapDbToApi(result.rows[0]);
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    const values: DbExerciseUpdate = {
      name: updateExerciseDto.name,
      slug: updateExerciseDto.name ? generateSlug(updateExerciseDto.name) : undefined,
      description: updateExerciseDto.description,
      allowed_rm_types: updateExerciseDto.allowedRmTypes,
      tags: updateExerciseDto.tags,
      primary_muscle_groups: updateExerciseDto.primaryMuscleGroups,
      videos: updateExerciseDto.videos,
      seo_title: updateExerciseDto.seoTitle,
      seo_description: updateExerciseDto.seoDescription,
      seo_keywords: updateExerciseDto.seoKeywords
    }

    const result = await this._db.update({
      table: 'exercises',
      data: values,
      condition: 'id = $1',
      conditionParams: [id],
      returning: '*'
    });

    if (result.rowCount === 0) {
      throw new NotFoundException({
        message: `No existe un ejercicio con el id ${id}`
      })
    }

    return this.mapDbToApi(result.rows[0]);
  }

  async remove(id: string): Promise<boolean> {
    return (await this._db.query('DELETE FROM exercises WHERE id = $1', [id])).rowCount === 1;
  }
}
