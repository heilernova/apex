import { Injectable } from '@nestjs/common';
import { PostgreSQlConnection } from './postgres';

@Injectable()
export class DatabaseService extends PostgreSQlConnection {}
