import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base-repository';

export interface ICountry {
  code: string;
  name: string;
  phoneCode: string;
  demonym: {
    masculine: string;
    feminine: string;
  };
}

export interface IAdministrativeLevel {
  id: string;
  level: number;
  name: string;
  namePlural: string;
}

export interface IAdministrativeDivision {
  id: string;
  name: string;
  code: string;
  levelId: string;
  parentId?: string;
  isCapital: boolean;
  isCity: boolean;
  enabled: boolean;
}

@Injectable()
export class GeoRepository extends BaseRepository {

  /** Obtener la lista de países */
  public async getCountries(): Promise<ICountry[]> {
    const sql = `
    select 
      code, 
      name,
      phone_code as "phoneCode",
      jsonb_build_object(
        'masculine', masculine_demonym,
        'feminine', feminine_demonym
      ) as demonym
    from geo_countries;
    `;
    const result = await this._db.query<ICountry>(sql);
    return result.rows;
  }

  /** Obtener los niveles administrativos de un país */
  public async getAdministrativeLevels(country: string): Promise<IAdministrativeLevel[]> {
    const sql = `
    select
      id,
      level,
      name,
      name_plural as "namePlural"
    from geo_administrative_levels
    where country_code = $1;
    `;
    const result = await this._db.query<IAdministrativeLevel>(sql, [country]);
    return result.rows;
  }

  /** Obtener las divisiones administrativas de un país*/
  public async getAdministrativeDivisions(country: string, levelId: string, parentId?: string): Promise<IAdministrativeDivision[]> {
    const params = [country, levelId];
    let sql = `
    select
      id,
      name,
      code,
      level_id as "levelId",
      parent_id as "parentId",
      is_capital as "isCapital",
      is_city as "isCity",
      enabled
    from geo_administrative_divisions
    where country_code = $1 and level_id = $2
    `;

    if (parentId) {
      sql += ` and parent_id = $3`;
      params.push(parentId);
    }

    const result = await this._db.query<IAdministrativeDivision>(sql, params);
    return result.rows;
  }

  /** Verifica si una división administrativa existe */
  public async existsAdministrativeDivision(divisionId: string): Promise<boolean> {
    const sql = `
    select count(1) as count
    from geo_administrative_divisions
    where id = $1;
    `;
    const result = await this._db.query<{ count: number }>(sql, [divisionId]);
    return result.rows[0].count > 0;
  }
}
