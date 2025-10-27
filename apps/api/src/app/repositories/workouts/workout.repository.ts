import { Injectable } from '@nestjs/common';
import { IWorkoutDbCreate, IWorkoutDbUpdate } from '@app/schemas/workouts';
import { BaseRepository } from '../base-repository';
import { IWorkout, IWorkoutCreate, IWorkoutUpdate } from './workout.interfaces';
import { generateSlug } from '@app/shared';

@Injectable()
export class WorkoutRepository extends BaseRepository {
  private readonly tableName = 'workouts';
  private readonly tableViewName = 'vi_workouts_api';

  public async getAll(filter?: {
    published?: boolean;
  }): Promise<IWorkout[]> {
    const whereClauses: string[] = [];
    const params: unknown[] = [];
    let sql = `select * from ${this.tableViewName}`;
    if (filter?.published !== undefined) {
      whereClauses.push(`published = $${params.length + 1}`);
      params.push(filter.published);
    }
    if (whereClauses.length > 0) {
      sql += ` where ${whereClauses.join(' and ')}`;
    }
    const result = await this._db.query<IWorkout>(sql, params);
    return result.rows;
  }

  public async get(id: string): Promise<IWorkout | null> {
    const sql = `select * from ${this.tableViewName} where id = $1`;
    const result = await this._db.query<IWorkout>(sql, [id]);
    return result.rows[0] || null;
  }

  public async getBySlug(slug: string): Promise<IWorkout | null> {
    const sql = `select * from ${this.tableViewName} where slug = $1`;
    const result = await this._db.query<IWorkout>(sql, [slug]);
    return result.rows[0] || null;
  }

  public async create(data: IWorkoutCreate): Promise<IWorkout> {
    const values: IWorkoutDbCreate = {
      name: data.name,
      description: data.description || null,
      type: data.type,
      slug: generateSlug(data.name),
      time_cap: data.timeCap,
      score_order: data.scoreOrder,
      content: data.content,
      disciplines: data.disciplines || [],
      difficulty: data.difficulty,
      seo_keywords: data.seo?.keywords,
      seo_description: data.seo?.description,
      seo_title: data.seo?.title
    }

    const result = await this._db.insert<IWorkout>({
      table: this.tableName,
      data: values,
      returning: [
        'id',
        'created_at as createdAt',
        'updated_at as updatedAt',
        'published',
        'gym_id as gymId',
        'name',
        'description',
        'type',
        'time_cap as timeCap',
        'score_order as scoreOrder',
        'difficulty',
        'disciplines',
        'content',
        'slug',
        `jsonb_build_object(
          'title', w.seo_title,
          'description', w.seo_description,
          'keywords', w.seo_keywords,
          'openGraphImages', w.seo_open_graph_images
        ) as "seo"`,
        'images'
      ]
    });

    return result.rows[0];
  }

  public async update(id: string, data: IWorkoutUpdate): Promise<IWorkout | null> {
    const values: IWorkoutDbUpdate = {
      name: data.name,
      description: data.description,
      type: data.type,
      slug: data.name ? generateSlug(data.name) : undefined,
      time_cap: data.timeCap,
      score_order: data.scoreOrder,
      content: data.content,
      disciplines: data.disciplines,
      difficulty: data.difficulty,
      seo_keywords: data.seo?.keywords,
      seo_description: data.seo?.description,
      seo_title: data.seo?.title
    }

    const result = await this._db.update<IWorkout>({
      table: this.tableName,
      data: values,
      condition: 'id = $1',
      conditionParams: [id],
      returning: [
        'id',
        'created_at as createdAt',
        'updated_at as updatedAt',
        'published',
        'gym_id as gymId',
        'name',
        'description',
        'type',
        'time_cap as timeCap',
        'score_order as scoreOrder',
        'difficulty',
        'disciplines',
        'content',
        'slug',
        `jsonb_build_object(
          'title', w.seo_title,
          'description', w.seo_description,
          'keywords', w.seo_keywords,
          'openGraphImages', w.seo_open_graph_images
        ) as "seo"`,
        'images'
      ]
    });

    return result.rows[0];
  }

  public async delete(id: string): Promise<boolean> {
    const sql = `delete from ${this.tableName} where id = $1`;
    const result = await this._db.query(sql, [id]);
    return result.rowCount === 1;
  }
}
