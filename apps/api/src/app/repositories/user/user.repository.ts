import { Injectable } from '@nestjs/common';
import { AthleteCategory, JudgeLevel, UserGender, UserRole, UserStatus } from '@app/schemas/types';
import { OmitBy, PartialBy } from '@app/schemas/types/utils';
import { isEmail, isUUID } from 'class-validator';
import { DatabaseService } from '../../database/database.service';
import { DbUserInsert, DbUserUpdate } from '@app/schemas/db';
import { hash } from 'argon2';

const fields = [
  'id',
  'created_at as "createdAt"',
  'updated_at as "updatedAt"',
  'last_login_at as "lastLoginAt"',
  'status',
  'role',
  'is_coach as "isCoach"',
  'judge_level as "judgeLevel"',
  'verified',
  'category',
  `jsonb_build_object('address', email, 'verified', email_verified) as email`,
  `jsonb_build_object('number', cellphone, 'verified', cellphone_verified) as cellphone`,
  'username',
  'alias',
  'first_name as "firstName"',
  'last_name as "lastName"',
  'gender',
  'birthdate',
  'extract(year from age(birthdate))::int as age',
  'height',
  'weight',
  'city_id as "cityId"',
  'nationality',
  'permissions',
  'jwt_secret as "jwtSecret"',
  'password_hash as "passwordHash"',
  `jsonb_build_object('avatar', avatar_url, 'cover', cover_url, 'body', body_image_url) as media`
]

const sqlBase = `
  select
    ${fields.join(', ')}
  from users
`;

@Injectable()
export class UserRepository {
  constructor(
    private readonly _db: DatabaseService
  ) { }

  /**
   * Verifica si un email ya existe en la base de datos.
   * @param email El email a verificar.
   * @param ignoreId El ID a ignorar (para actualizaciones).
   * @returns True si el email existe, false en caso contrario.
   */
  public async emailExists(email: string, ignoreId?: string): Promise<boolean> {
    let condition: string, params: string[];
    if (ignoreId) {
      condition = 'email = $1 AND id != $2';
      params = [email, ignoreId];
    } else {
      condition = 'email = $1';
      params = [email];
    }
    const result = await this._db.query<{ count: number }>(`SELECT COUNT(*) as count FROM users WHERE ${condition}`, params);
    return result.rows[0].count === 1;
  }

  /**
   * Verifica si un nombre de usuario ya existe en la base de datos.
   * @param username El nombre de usuario a verificar.
   * @param ignoreId El ID a ignorar (para actualizaciones).
   * @returns True si el nombre de usuario existe, false en caso contrario.
   */
  public async usernameExists(username: string, ignoreId?: string): Promise<boolean> {
    let condition: string, params: string[];
    if (ignoreId) {
      condition = 'username = $1 AND id != $2';
      params = [username, ignoreId];
    } else {
      condition = 'username = $1';
      params = [username];
    }
    const result = await this._db.query<{ count: number }>(`SELECT COUNT(*) as count FROM users WHERE ${condition}`, params);
    return result.rows[0].count === 1;
  }

  /**
   * Obtiene un usuario de la base de datos.
   * @param value ID, correo electrónico o nombre de usuario
   */
  public async get(value: string): Promise<IUser | null> {
    let query = sqlBase;
    
    if (isEmail(value)) {
      query += ' WHERE lower(email) = lower($1)';
    } else if (isUUID(value)) {
      query += ' WHERE id = $1';
    } else {
      query += ' WHERE lower(username) = lower($1)';
    }
    
    const result = await this._db.query<IUser>(query, [value]);
    return result.rows[0] ?? null;
  }

  /**
   * Obtiene todos los usuarios de la base de datos.
   * @param filter Filtros para la consulta
   * @returns Una lista de usuarios
   */
  public async getAll(filter?: {
    role?: UserRole;
    isCoach?: boolean;
    judgeLevel?: JudgeLevel;
    limit?: number;
    offset?: number;
  }): Promise<IUser[]> {
    const sql = sqlBase;
    const params: (string | boolean | number)[] = [];
    const conditions: string[] = [];
    
    // Filtros
    if (filter?.role) {
      conditions.push(`role = $${params.push(filter.role)}`);
    }
    if (filter?.isCoach !== undefined) {
      conditions.push(`is_coach = $${params.push(filter.isCoach)}`);
    }
    if (filter?.judgeLevel !== undefined) {
      if (filter.judgeLevel === null) {
        conditions.push(`judge_level IS NULL`);
      } else {
        conditions.push(`judge_level = $${params.push(filter.judgeLevel)}`);
      }
    }

    const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
    
    // Agregar LIMIT y OFFSET si se especifican
    let limitClause = ' LIMIT 100'; // Límite por defecto para evitar consultas muy grandes
    if (filter?.limit && filter.limit > 0) {
      limitClause = ` LIMIT $${params.push(filter.limit)}`;
    }
    
    let offsetClause = '';
    if (filter?.offset && filter.offset > 0) {
      offsetClause = ` OFFSET $${params.push(filter.offset)}`;
    }
    
    const finalQuery = sql + whereClause + limitClause + offsetClause;
    const result = await this._db.query<IUser>(finalQuery, params);
    return result.rows;
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param data Datos del nuevo usuario
   * @returns El usuario creado
   */
  public async create(data: NewUser): Promise<IUser> {
    const values: DbUserInsert = {
      status: 'active',
      category: data.category || 'beginner',
      role: data.role || 'user',
      is_coach: data.isCoach || false,
      judge_level: data.judgeLevel ??  null,
      verified: data.verified || false,
      email: data.email,
      email_verified: false,
      cellphone: data.cellphone,
      cellphone_verified: false,
      username: data.username,
      alias: data.alias || null,
      first_name: data.firstName,
      last_name: data.lastName,
      gender: data.gender,
      birthdate: data.birthdate,
      height: data.height,
      weight: data.weight,
      city_id: data.cityId,
      nationality: data.nationality,
      password_hash: await hash(data.password),
      permissions: data.permissions || []
    }

    const result = await this._db.insert<IUser>({
      table: 'users',
      data: values,
      returning: fields
    });

    await this._db.insert({
      table: 'user_weights',
      data: {
        user_id: result.rows[0].id,
        weight: data.weight
      },
      returning: '*'
    });
  
    return result.rows[0];
  }

  /**
   * Actualiza un usuario en la base de datos.
   * @param id ID del usuario a actualizar
   * @param update Datos a actualizar
   * @returns El usuario actualizado o null si no se encontró.
   */
  public async update(id: string, update: UpdateUser): Promise<IUser | null> {
    const values: DbUserUpdate = {
      updated_at: new Date(),
      last_login_at: update.lastLoginAt,
      status: update.status,
      role: update.role,
      is_coach: update.isCoach,
      judge_level: update.judgeLevel,
      verified: update.verified,
      category: update.category,
      alias: update.alias ? update.alias : (update.alias === null ? null : undefined),
      first_name: update.firstName?.toUpperCase(),
      last_name: update.lastName?.toUpperCase(),
      gender: update.gender,
      birthdate: update.birthdate,
      height: update.height,
      weight: update.weight,
      city_id: update.cityId,
      nationality: update.nationality,
      permissions: update.permissions,
      password_hash: update.password ? await hash(update.password) : undefined,
      avatar_url: update.media?.avatar,
      cover_url: update.media?.cover,
      body_image_url: update.media?.body,
      username: update.username
    }

    if (update.cellphone) {
      values.cellphone_verified = false;
      values.cellphone = update.cellphone;
    }

    if (update.email) {
      values.email_verified = false;
      values.email = update.email;
    }

    if (update.weight) {
      await this._db.insert({
        table: 'user_weights',
        data: {
          user_id: id,
          weight: update.weight
        },
        returning: '*'
      });
    }

    const result = await this._db.update<IUser>({
      table: 'users',
      data: values,
      condition: 'id = $1',
      conditionParams: [id],
      returning: fields
    });
    return result.rows[0] || null;
  }

  /**
   * Elimina un usuario de la base de datos.
   * @param id ID del usuario a eliminar
   * @returns Verdadero si se eliminó el usuario, falso en caso contrario.
   */
  public async delete(id: string): Promise<boolean> {
    const result = await this._db.query<{ count: number }>('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount === 1;
  }
}


export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  status: UserStatus;
  role: UserRole;
  isCoach: boolean;
  judgeLevel: JudgeLevel | null; 
  verified: boolean;
  category: AthleteCategory;
  email: {
    address: string;
    verified: boolean;
  };
  cellphone: {
    number: string;
    verified: boolean;
  };
  username: string;
  alias: string | null;
  firstName: string;
  lastName: string;
  gender: UserGender;
  birthdate: Date;
  height: number;
  weight: number;
  cityId: string;
  nationality: string;
  permissions: string[];
  jwtSecret: string;
  passwordHash: string;
  media: {
    avatar: string | null;
    cover: string | null;
    body: string | null;
  };
}

export type NewUser = PartialBy<OmitBy<IUser, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'media' | 'email' | 'cellphone' | 'passwordHash' | 'jwtSecret'>, 'permissions' | 'verified' | 'status' | 'alias' | 'judgeLevel' | 'category' | 'isCoach' | 'role' | 'verified'> & {
  email: string;
  cellphone: string;
  password: string;
};

export type UpdateUser = Partial<OmitBy<IUser, 'id' | 'createdAt' | 'passwordHash' | 'email' | 'cellphone'>> & {
  cellphone?: string;
  email?: string;
  password?: string;
}