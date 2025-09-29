import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class GeoService {
  constructor(private readonly _db: DatabaseService) {}

  public async getCountries(): Promise<{ code: string; name: string; phoneCode: string; demonym: { masculine: string; feminine: string } }[]> {
    return (await this._db.query(`SELECT code, name, phone_code as "phoneCode", json_build_object('masculine', masculine_demonym, 'feminine', feminine_demonym) as demonym FROM geo_countries`)).rows;
  }

  public async getCountryByCode(code: string): Promise<{ code: string; name: string; phoneCode: string; demonym: { masculine: string; feminine: string } } | null> {
    const result = await this._db.query(`SELECT code, name, phone_code as "phoneCode", json_build_object('masculine', masculine_demonym, 'feminine', feminine_demonym) as demonym FROM geo_countries WHERE code = $1`, [code]);
    return result.rows[0] || null;
  }

  public async getStates(countryCode: string): Promise<{ code: string; name: string }[]> {
    return (await this._db.query(`SELECT code, name FROM geo_states WHERE country_code = $1`, [countryCode])).rows;
  }

  public async getStatesWithCities(countryCode: string): Promise<{ code: string; name: string; cities: { id: number; name: string; latitude: number; longitude: number }[] }[]> {

    const sql = `
      SELECT s.id, s.name, 
        json_agg(json_build_object('id', c.id, 'name', c.name)) AS cities
      FROM geo_states s
      LEFT JOIN geo_cities c ON s.id = c.state_id
      WHERE s.country_code = $1
      GROUP BY s.id, s.name
    `;

    const states = await this._db.query(sql, [countryCode]);
    return states.rows;
  }
}
