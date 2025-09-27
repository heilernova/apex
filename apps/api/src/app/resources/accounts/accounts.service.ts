import { Injectable } from '@nestjs/common';
import { DbUser } from '@app/schemas/db';
import { AthleteCategory, JudgeLevel } from '@app/schemas/types';
import { ApiAccountSchema } from '@app/schemas/api/accounts';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AccountsService {
  constructor(
    private readonly _db: DatabaseService
  ) { }

  public async getAll(filter?: { isCoach?: boolean, isJudge?: boolean, judgeLevel?: JudgeLevel | null, category?: AthleteCategory, limit?: number, offset?: number }): Promise<ApiAccountSchema[]> {
    const sql = `SELECT *, EXTRACT(YEAR FROM AGE(birthdate)) as age FROM users`;
    const conditions = [];
    const params = [];
    if (filter?.category) {
      conditions.push(`category = $${params.push(filter.category)}`);
    }

    if (filter?.isCoach !== undefined) {
      conditions.push(`is_coach = $${params.push(filter.isCoach)}`);
    }
    
    if (filter?.isJudge) {
      conditions.push(`judge_level IS NOT NULL`);
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
    const result = (await this._db.query<DbUser & { age: number }>(finalQuery, params)).rows;
    
    return result.map(user => this.mapToApiAccountSchema(user));
  }

  private mapToApiAccountSchema(user: DbUser & { age: number }): ApiAccountSchema {
    return {
      id: user.id,
      verified: user.verified,
      username: user.username,
      email: {
        address: user.email,
        verified: user.email_verified,
      },
      cellphone: {
        number: user.cellphone,
        verified: user.cellphone_verified,
      },
      profile: {
        firstName: user.first_name,
        lastName: user.last_name,
        alias: user.alias,
        gender: user.gender,
        birthdate: user.birthdate,
        age: user.age,
      },
      physical: {
        height: user.height,
        weight: user.weight,
      },
      location: {
        cityId: user.city_id,
        nationality: user.nationality,
      },
      access: {
        role: user.role,
        permissions: user.permissions,
        isCoach: user.is_coach,
        judgeLevel: user.judge_level
      }
    };
  }
}
