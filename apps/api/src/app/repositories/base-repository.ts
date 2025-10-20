import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database";
import { ConfigService } from "../config";

// Servicio base
@Injectable()
export class BaseRepository {
  constructor(
    protected readonly _db: DatabaseRepository,
    protected readonly _config: ConfigService
  ) {}
}
