import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  public readonly jwtSecret: string;
  public readonly storagePath: string;

  constructor() {
    const processEnv = process.env;
    this.jwtSecret = processEnv.JWT_SECRET || crypto.randomUUID();
    this.storagePath = processEnv.APP_STORAGE_PATH || './storage';
  }
}
