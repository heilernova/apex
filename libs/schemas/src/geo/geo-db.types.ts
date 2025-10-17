export interface GeoDb {
  code: string;
  name: string;
  phone_code: string;
  masculine_demonym: string;
  feminine_demonym: string;
}

export interface GeoAdministrativeLevelDb { 
  id: string;
  country_code: string;
  level: number;
  name: string;
  name_plural: string | null;
  description: string | null;
}

export interface GeoAdministrativeDivisionDb {
  id: string;
  country_code: string;
  level_id: string;
  parent_id: string | null;
  code: string | null;
  name: string;
  is_city: boolean;
  is_capital: boolean;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
}