export interface GeoCountry {
  code: string;
  name: string;
  phoneCode: string;
  demonym: {
    masculine: string;
    feminine: string;
  }
}

export interface GeoAdministrativeLevel {
  id: string;
  countryCode: string;
  level: number;
  name: string;
  namePlural: string | null;
  description: string | null;
}

export interface GeoAdministrativeDivision {
  id: string;
  countryCode: string;
  levelId: string;
  parentId: string | null;
  code: string | null;
  name: string;
  isCity: boolean;
  isCapital: boolean;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}