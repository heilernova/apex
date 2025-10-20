import { BaseResponse } from '../common';

export interface ApiGeoCountry {
  name: string;
  code: string;
  phoneCode: string;
  demonym: {
    masculine: string;
    feminine: string;
  }
}

export interface ApiGeoAdministrativeLevel {
  level: number;
  countryCode: string;
  name: string;
  namePlural: string;
}

export interface ApiGeoAdministrativeDivision {
  id: string;
  countryCode: string;
  levelId: string;
  parentId: string | null;
  code: string;
  name: string;
  isCity: boolean;
  isCapital: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiGeoGetAllCountriesResponse extends BaseResponse {
  data: ApiGeoCountry[];
}

export interface ApiGeoGetAllAdministrativeLevelsResponse extends BaseResponse {
  data: ApiGeoAdministrativeLevel[];
}

export interface ApiGeoAdministrativeDivisionQueryParams {
  country?: string;
  level?: number;
  parent?: string;
}

export interface ApiGetGetAllAdministrativeDivisionsResponse extends BaseResponse {
  data: ApiGeoAdministrativeDivision[];
}
