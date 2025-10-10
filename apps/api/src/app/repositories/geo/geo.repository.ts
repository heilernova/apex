import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { isUUID } from 'class-validator';

@Injectable()
export class GeoRepository {
  constructor(
    private readonly _db: DatabaseService
  ) {}

  /**
   * Obtiene la lista de países
   * @returns Lista de países
   */
  public async getCountries(): Promise<IGeoCountry[]> {
     const sql = `
      select
        id,
        code,
        phone_code as "phoneCode",
        name,
        json_build_object('masculine', masculine_demonym, 'feminine', feminine_demonym) as demonym
      from geo_countries
    `;
    return (await this._db.query<IGeoCountry>(sql)).rows;
  }

  /**
   * Obtiene un país por su código (ISO 3166-1 alpha-2)
   * @param code Código del país (ISO 3166-1 alpha-2)
   * @returns Información del país o null si no se encuentra
   */
  public async getCountryByCode(code: string): Promise<IGeoCountry | null> {
    const result = await this._db.query<IGeoCountry>(`SELECT id, code, phone_code as "phoneCode", name, json_build_object('masculine', masculine_demonym, 'feminine', feminine_demonym) as demonym FROM geo_countries WHERE code = $1`, [code]);
    return result.rows[0] || null;
  }

  /**
   * Obtiene los niveles administrativos de un país.
   * @param value ID o código del país
   * @returns Lista de niveles administrativos
   */
  public async getAdministrativeLevels(value: string): Promise<IGeoAdministrativeLevel[]> {
    const condition = isUUID(value) ? 'country_id = $1' : ' country_id = (SELECT id FROM geo_countries WHERE code = $1)';
    const params = isUUID(value) ? [value] : [value.toUpperCase()];
    const result = await this._db.query<IGeoAdministrativeLevel>(`SELECT id, name, name_plural as "namePlural", level FROM geo_administrative_levels WHERE ${condition}`, params);
    return result.rows;
  }

  /**
   * Obtiene todas las divisiones administrativas de un nivel.
   * @param id ID del nivel administrativo
   * @returns Lista de divisiones administrativas
   */
  public async getAllAdministrationDivisions(id: string): Promise<IGeoDivision[]> {
    const sql = `select
      id,
      country_id as "countryId",
      level_id as "levelId",
      parent_id as "parentId",
      code,
      name,
      is_capital as "isCapital",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from geo_administrative_divisions where level_id = $1 order by is_capital, name`;
    const result = await this._db.query<IGeoDivision>(sql, [id]);
    return result.rows;
  }

  /**
   * Obtiene las divisiones administrativas hijas de una división dada.
   * @param id ID de la división administrativa padre
   * @returns Lista de divisiones administrativas hijas
   */
  public async getChildDivisions(id: string): Promise<IGeoDivision[]> {
    const sql = `select 
      id,
      country_id as "countryId",
      level_id as "levelId",
      parent_id as "parentId",
      code,
      name,
      is_capital as "isCapital",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from geo_administrative_divisions where parent_id = $1 order by is_capital desc, name`;
    const result = await this._db.query<IGeoDivision>(sql, [id]);
    return result.rows;
  }
}

export interface IGeoCountry { 
  id: string;
  code: string;
  phoneCode: string;
  name: string;
  demonym: {
    masculine: string;
    feminine: string;
  };
}

export interface IGeoAdministrativeLevel {
  id: string;
  name: string;
  namePlural: string;
  level: number;
}

export interface IGeoDivision {
  id: string;
  countryId: string;
  levelId: string;
  parentId: string | null;
  code: string;
  name: string;
  isCapital: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}