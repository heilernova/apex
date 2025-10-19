export interface CorsConfig {
  origin?: string[] | boolean;
  credentials?: boolean;
  optionsSuccessStatus?: number;
  methods?: string[];
  allowedHeaders?: string[];
}

export function getCorsConfig(): CorsConfig  | undefined {
  const nodeEnv = process.env['NODE_ENV'] || 'production';

  if (nodeEnv === 'production' ) {
    const allowedOrigins = process.env['ALLOWED_ORIGINS'];

    return {
      origin: allowedOrigins ? allowedOrigins.split(',').map(origin => origin.trim()) : undefined,
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  if (nodeEnv === 'development') {
    return {
      origin: ['http://localhost:7031'],
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }
  return undefined;
}
