export interface IGeoCountry {
  code: string;
  name: string;
  phoneCode: string;
  demonym: {
    masculine: string;
    feminine: string;
  };
}

export class GeoCountry {
  public readonly code: string;
  public readonly name: string
  public readonly phoneCode: string;
  public readonly demonym: {
    masculine: string;
    feminine: string;
  };

  constructor(data: IGeoCountry) {
    this.code = data.code;
    this.name = data.name;
    this.phoneCode = data.phoneCode;
    this.demonym = data.demonym;
  }
}