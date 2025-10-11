import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

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
   * @param code Código del país
   * @returns Lista de niveles administrativos
   */
  public async getAdministrativeLevels(code: string): Promise<IGeoAdministrativeLevel[]> {
    const condition = 'country_code = $1';
    const result = await this._db.query<IGeoAdministrativeLevel>(`SELECT id, name, name_plural as "namePlural", level FROM geo_administrative_levels WHERE ${condition}`, [code.toUpperCase()]);
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
      country_code as "countryCode",
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

  public async getAdministrativeDivisionsByCountryCode(countryCode: string): Promise<IGeoDivision[]> {
    const sql = `select 
      gad.id,
      gad.country_code as "countryCode",
      gad.level_id as "levelId",
      gad.parent_id as "parentId",
      gad.code,
      gad.name,
      gad.is_capital as "isCapital",
      gad.is_active as "isActive",
      gad.created_at as "createdAt",
      gad.updated_at as "updatedAt"
    from geo_administrative_divisions gad
    where gad.country_code = $1
    order by gad.is_capital desc, gad.name`;
    const result = await this._db.query<IGeoDivision>(sql, [countryCode.toUpperCase()]);
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
      country_code as "countryCode",
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

  /**
   * Obtiene una división administrativa por su ID.
   * @param id Id de la división administrativa
   * @returns Información de la división o null si no se encuentra
   */
  public async getDivision(id: string): Promise<IGeoDivision | null> {
     const sql = `select 
      id,
      country_code as "countryCode",
      level_id as "levelId",
      parent_id as "parentId",
      code,
      name,
      is_capital as "isCapital",
      is_active as "isActive",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from geo_administrative_divisions where where id = $1 limit 1`;
    const result = await this._db.query<IGeoDivision>(sql, [id]);
    return result.rows[0] ?? null;
  }

  /**
   * Verifica si una división administrativa existe.
   * @param id ID de la división administrativa
   * @returns Verdadero si existe, falso en caso contrario
   */
  public async existsDivision(id: string): Promise<boolean> {
    const result = await this._db.query(`SELECT 1 FROM geo_administrative_divisions WHERE id = $1 LIMIT 1`, [id]);
    return result.rowCount === 1;
  }

  /**
   * Verifica si un país existe.
   * @param code Código del país (ISO 3166-1 alpha-2)
   * @returns Verdadero si existe, falso en caso contrario
   */
  public async existsCountry(code: string): Promise<boolean> {
    const result = await this._db.query(`SELECT 1 FROM geo_countries WHERE code = upper($1) LIMIT 1`, [code]);
    return result.rowCount === 1;
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