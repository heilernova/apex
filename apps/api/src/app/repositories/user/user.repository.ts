import { Injectable } from '@nestjs/common';
import { isEmail, isUUID } from 'class-validator';
import { NewUserDb, UpdateUserDb } from '@app/schemas/users';
import { hash } from 'argon2';
import { BaseRepository } from '../base-repository';
import { IUser, IUserCreate, IUserUpdate } from './user.interfaces';
import { AthleteCategory, JudgeLevel } from '@app/schemas/common';

@Injectable()
export class UserRepository extends BaseRepository {

  /**
   * Obtiene un usuario por su UUID, correo electrónico o nombre de usuario.
   * @param value UUID, usuario o correo electrónico
   * @returns 
   */ 
  public async get(value: string): Promise<IUser | null> {
    let sql = 'select * from vi_users_api where ';
    if (isUUID(value)) {
      sql += 'id = $1';
    } else if (isEmail(value)) {
      sql += "lower(email->>'address') = lower($1)";
    } else {
      sql += 'lower(username) = lower($1)';
    }
    const result = await this._db.query<IUser>(sql, [value]);
    return result.rows[0] ?? null;
  }

  /**
   * Obtiene un usuario por su sessionKey.
   * @param sessionKey 
   * @returns 
   */
  public async getBySessionKey(sessionKey: string): Promise<IUser | null> {
    const sql = 'select * from vi_users_api where "sessionKey" = $1';
    const result = await this._db.query<IUser>(sql, [sessionKey]);
    return result.rows[0] ?? null;
  }

  /**
   * Retorna todos los usuarios.
   * @returns 
   */
  public async getAll(filter?: { isCoach?: boolean, judged?: boolean, judgedLevels?: JudgeLevel[], categories?: AthleteCategory[], locationId?: string }): Promise<IUser[]> {
    let sql = 'select * from vi_users_api';
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filter?.isCoach){
      conditions.push('"isCoach" = true');
    }

    if (filter?.judged) {
      conditions.push('"judgeLevel" is not null');
    }

    if (filter?.judgedLevels?.length) {
      conditions.push(`"judgeLevel" = ANY($${ params.push(filter.judgedLevels)})`);
     ;
    }

    if (filter?.categories) {
      conditions.push(`"category" = ANY($${params.push(filter.categories)})`);
    }

    if (filter?.locationId) {
      conditions.push(`"locationId" = $${params.push(filter.locationId)}`);
    }

    if (conditions.length) {
      sql += ' where ' + conditions.join(' and ');
    }

    const result = await this._db.query<IUser>(sql, params);
    return result.rows;
  }

  public async getAthletes() {
    const sql = 'select * from vi_athletes_api';
    const result = await this._db.query<{ id: string; name: string; }>(sql);
    return result.rows;
  }

  /**
   * Crea un nuevo usuario.
   * @param data 
   * @returns UUID del usuario
   */
  public async create(data: IUserCreate): Promise<string> {
    const values: NewUserDb = {
      username: data.username,
      email_address: data.email.toLowerCase(),
      email_verified: false,
      cellphone_number: data.cellphone,
      cellphone_verified: false,
      first_name: data.firstName.toUpperCase(),
      last_name: data.lastName.toUpperCase(),
      alias: data.alias ? data.alias.toUpperCase() : null,
      gender: data.gender,
      birthdate: data.birthdate,
      height: data.height,
      weight: data.weight,
      is_coach: false,
      role: 'user',
      status: 'active',
      judge_level: null,
      category: data.category,
      location_id: data.locationId,
      nationality: data.nationality,
      disciplines: data.disciplines,
      password_hash: await hash(data.password),
      secret_key: crypto.randomUUID(),
      session_key: crypto.randomUUID(),
      permissions: []
    }

    const result = await this._db.insert({
      table: 'users',
      data: values,
      returning: ['id']
    });

    return result.rows[0].id;
  }

  /**
   * Actualiza un usuario.
   * @param id UUID del usuario
   * @param data Datos a actualizar
   * @returns Retorna true si se actualizó correctamente, de lo contrario false.
   */
  public async update(id: string, data: IUserUpdate): Promise<boolean> {
    const values: UpdateUserDb = {
      first_name: data.firstName?.toUpperCase(),
      last_name: data.lastName?.toUpperCase(),
      alias: data.alias !== undefined ? (data.alias ? data.alias.toUpperCase() : null) : undefined,
      gender: data.gender,
      birthdate: data.birthdate,
      height: data.height,
      weight: data.weight,
      category: data.category,
      athlete_photo: data.athletePhoto,
      avatar: data.avatar,
      cover: data.cover,
      disciplines: data.disciplines,
      password_hash: data.password ? await hash(data.password) : undefined,
      is_coach: data.isCoach,
      role: data.role,
      judge_level: data.judgeLevel,
      nationality: data.nationality,
      location_id: data.locationId,
      username: data.username,
      secret_key: data.secretKey,
      status: data.status,
      verified: data.verified,
      permissions: data.permissions,
      social_media: data.socialMedia,
      session_key: data.sessionKey,
    };

    if (data.email) {
      values.email_address = data.email.toLowerCase();
      values.email_verified = false;
    }

    if (data.cellphone) {
      values.cellphone_number = data.cellphone;
      values.cellphone_verified = false;
    }

    const result = await this._db.update({
      table: 'users',
      data: values,
      condition: 'id = $1',
      conditionParams: [id],
    });

    if (data.weight) {
      await this._db.insert({
        table: 'user_weights',
        data: {
          user_id: id,
          weight: data.weight
        },
      });
    }

    return result.rowCount === 1;
  }

  /**
   * Elimina un usuario.
   * @param id UUID del usuario
   * @returns Retorna true si se eliminó correctamente, de lo contrario false.
   */
  public async delete(id: string): Promise<boolean> {
    const result = await this._db.delete({
      table: 'users',
      condition: 'id = $1',
      conditionParams: [id],
    });
    return result.rowCount === 1;
  }

  /**
   * Establece la fecha y hora del último inicio de sesión de un usuario.
   * @param id UUID del usuario
   * @returns Retorna true si se actualizó correctamente, de lo contrario false.
   */
  public async setLastLogin(id: string): Promise<boolean> {
    const result = await this._db.update({
      table: 'users',
      data: {
        last_login_at: new Date(),
      },
      condition: 'id = $1',
      conditionParams: [id],
    });
    return result.rowCount === 1;
  }

  public async existsUsername(username: string, ignoreId?: string): Promise<boolean> {
    let sql = 'select count(1) as count from users where lower(username) = lower($1)';
    const params: unknown[] = [username];
    if (ignoreId) {
      sql += ' and id <> $2';
      params.push(ignoreId);
    }
    const result = await this._db.query<{ count: number }>(sql, params);
    return result.rows[0].count > 0;
  }
  
  public async existsEmail(email: string, ignoreId?: string): Promise<boolean> {
    let sql = 'select count(1) as count from users where lower(email_address) = lower($1)';
    const params: unknown[] = [email];
    if (ignoreId) {
      sql += ' and id <> $2';
      params.push(ignoreId);
    }
    const result = await this._db.query<{ count: number }>(sql, params);
    return result.rows[0].count > 0;
  }
}
