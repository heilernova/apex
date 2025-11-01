import { Injectable } from '@nestjs/common';
import { IWorkoutDbCreate, IWorkoutDbUpdate, IWorkout, IWorkoutCreate, IWorkoutUpdate } from '@app/schemas/workouts';
import { BaseRepository } from '../base-repository';
import { generateSlug, OmitBy } from '@app/shared';

@Injectable()
export class WorkoutRepository extends BaseRepository {
  private readonly tableName = 'workouts';
  private readonly tableViewName = 'vi_workouts_api';

  public async getAll(filter?: {
    published?: boolean;
    userId?: string;
  }): Promise<IWorkout[]> {
    const whereClauses: string[] = [];
    const params: unknown[] = [];
    let sql = `select * from ${this.tableViewName}`;
    if (filter?.published) {
      whereClauses.push(`status = $${params.push('published')}`);
    }

    if (filter?.userId) {
      whereClauses.push(`id in (select workout_id from workouts_users where user_id = $${params.push(filter.userId)})`);
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

  public async getAuthors(workoutId: string): Promise<{ id: string; username: string; name: string; avatar: string | null }[]> {
    const sql = `
      select u.id, u.username, u.name, u.avatar
      from workouts_users wu
      join users u on wu.user_id = u.id
      where wu.workout_id = $1
    `;
    const result = await this._db.query(sql, [workoutId]);
    return result.rows;
  }

  public async create(data: IWorkoutCreate&{ userId: string }): Promise<OmitBy<IWorkout, 'authors'>> {
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

    const transaction = await this._db.transaction();

    const result = await transaction.insert<OmitBy<IWorkout, 'authors'>>({
      table: this.tableName,
      data: values,
      returning: [
        'id',
        'created_at as createdAt',
        'updated_at as updatedAt',
        'status',
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
          'title', seo_title,
          'description', seo_description,
          'keywords', seo_keywords,
          'openGraphImages', seo_open_graph_images
        ) as "seo"`,
        'images'
      ]
    });

    await transaction.insert({
      table: 'workouts_users',
      data: {
        workout_id: result.rows[0].id,
        user_id: data.userId
      }
    });

    await transaction.commit();

    return result.rows[0];
  }

  public async update(id: string, data: IWorkoutUpdate): Promise<OmitBy<IWorkout, 'authors'> | null> {
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

    const result = await this._db.update<OmitBy<IWorkout, 'authors'>>({
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

  public async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    let sql = `select count(*) as count from ${this.tableName} where lower(name) = lower($1)`;
    const params: unknown[] = [name];
    if (excludeId) {
      sql += ` and id != $2`;
      params.push(excludeId);
    }
    const result = await this._db.query<{ count: string }>(sql, params);
    return result.rows[0].count === '0';
  }
}
