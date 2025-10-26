import { Injectable } from '@nestjs/common';
import { ExercisesDbInsert, ExercisesDbUpdate } from '@app/schemas/exercises';
import { BaseRepository } from '../base-repository';
import { IExercise, IExerciseCreate, IExerciseUpdate } from './exercise.interfaces';
import { generateSlug } from '@app/shared';

@Injectable()
export class ExerciseRepository extends BaseRepository {
  private tableName = 'exercises';
  private tableViewName = 'vi_exercises_api';

  /**
   * Obtener lista de los ejercicios
   * @param filters 
   * @returns 
   */
  public async getAll(filters: {
    published?: boolean;
  }): Promise<IExercise[]> {
    const whereClauses: string[] = [];
    const params: unknown[] = [];
    let sql = `select * from ${this.tableViewName}`;
    if (filters.published !== undefined) {
      whereClauses.push(`published = $${params.push(filters.published)}`);
    }
    if (whereClauses.length > 0) {
      sql += ` where ${whereClauses.join(' AND ')}`;
    }
    const result = await this._db.query<IExercise>(sql);
    return result.rows;
  }

  /**
   * @param id UUID del ejercicio
   * @returns 
   */
  public async get(id: string): Promise<IExercise | null> {
    const sql = `select * from ${this.tableViewName} where id = $1`;
    const result = await this._db.query<IExercise>(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * @param slug URL amigable del ejercicio
   * @returns 
   */
  public async getBySlug(slug: string): Promise<IExercise | null> {
    const sql = `select * from ${this.tableViewName} where slug = $1`;
    const result = await this._db.query<IExercise>(sql, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Crea un ejercicio
   * @param data 
   * @returns 
   */
  public async create(data: IExerciseCreate): Promise<IExercise> {
    const values: ExercisesDbInsert = {
      name_en: data.name.en,
      name_es: data.name.es,
      slug: generateSlug(data.name.en),
      published: false,
      allowed_rm_types: data.allowedRmTypes,
      muscle_groups: data.muscleGroups,
      tags: data.tags,
      description: data.description,
      seo_title: data.seo?.title,
      seo_description: data.seo?.description,
      seo_keywords: data.seo?.keywords
    };

    const result = await this._db.insert({
      table: this.tableName,
      data: values,
      returning: [
        'id',
        'created_at as "createdAt"',
        'updated_at as "updatedAt"',
        'published',
        `jsonb_build_object(
          'en', e.name_en,
          'es', e.name_es
        ) as "name"`,
        'slug',
        'allowed_rm_types as "allowedRmTypes"',
        'description',
        'tags',
        'muscle_groups as "muscleGroups"',
        'videos',
        `jsonb_build_object(
          'title', e.seo_title,
          'description', e.seo_description,
          'keywords', e.seo_keywords,
          'openGraphImages', e.seo_open_graph_images
        ) as "seo"`,
        'images'
      ]
    });
    return result.rows[0];
  }

  /**
   * Actualizar ejercicio
   * @param id UUID del ejercicio
   * @param update 
   * @returns
   */
  public async update(id: string, update: IExerciseUpdate): Promise<boolean> {
    const values: ExercisesDbUpdate = {
      name_en: update.name?.en,
      name_es: update.name?.es,
      allowed_rm_types: update.allowedRmTypes,
      published: update.published,
      tags: update.tags,
      description: update.description,
      images: update.images,
      muscle_groups: update.muscleGroups,
      seo_description: update.seo?.description,
      seo_title: update.seo?.title,
      seo_keywords: update.seo?.keywords,
      // seo_open_graph_images: update.
      slug: update.name?.en ? generateSlug(update.name.en) : undefined,
      updated_at: new Date(),
      videos: update.videos
    };

    const result = await this._db.update({
      table: this.tableName,
      condition: 'id = $1',
      conditionParams: [id],
      data: values,
      arrayColumns: ['videos']
    });

    return result.rowCount === 1;
  }

  /**
   * Eliminar un ejercicio
   * @param id UUID del ejercicio a eliminar
   * @returns 
   */
  public async delete(id: string): Promise<boolean> {
    const result = await this._db.delete({
      table: this.tableName,
      condition: 'id = $1',
      conditionParams: [id]
    });
    return result.rowCount === 1;
  }
}
