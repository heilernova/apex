export interface PostgresInterval {
  years?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  toISOString: () => string;
  toISO: () => string;
  toPostgres: () => string;
}