export interface IGeoCountry {
  code: string;
  name: string;
  phoneCode: string;
  demonym: {
    masculine: string;
    feminine: string;
  };

  data?: {
    levels: IGeoCountryLevel[];
    divisions: IGeoCountryDivision[];
  }
}

export interface IGeoCountryLevel {
  id: string;
  name: string;
  namePlural: string;
  level: number;
}

export interface IGeoCountryDivision{ 
  id: string;
  countryCode: string;
  levelId: string;
  parentId: string | null;
  code: string;
  name: string;
  isCapital: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}