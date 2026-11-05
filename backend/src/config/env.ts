import { configDotenv } from 'dotenv';
import { z, type ZodType } from 'zod';

configDotenv({ quiet: true });

export const NODE_ENV = validEnv(
  'NODE_ENV',
  z.enum(['development', 'production', 'test']),
);
export const FRONTEND_URL = validEnv('FRONTEND_URL', z.string());
export const PORT = validEnv('PORT', z.coerce.number().default(3000));
export const MONGODB_URI = validEnv('MONGODB_URI', z.string().nonempty());
export const JWT_EXPIRES_IN = validEnv('JWT_EXPIRES_IN', z.string().nonempty());
export const JWT_SECRET = validEnv('JWT_SECRET', z.string().nonempty());
export const ADMIN_EMAIL = validEnv(
  'ADMIN_EMAIL',
  z.email().transform((email) => email.toLowerCase()),
);
export const ADMIN_PASSWORD = validEnv(
  'ADMIN_PASSWORD',
  z.string().min(8),
);
export const AI_API_KEY = validEnv('AI_API_KEY', z.string());
export const AI_BASE_URL = validEnv(
  'AI_BASE_URL',
  z.string().default('https://api.openai.com/v1'),
);
export const AI_MODEL = validEnv('AI_MODEL', z.string());

function validEnv<TOutput>(
  variable: string,
  schema: ZodType<TOutput>,
): TOutput {
  const result = schema.safeParse(process.env[variable]);

  if (!result.success) {
    throw new Error(`Invalid environment variable '${variable}': ${result.error.message}`);
  }

  return result.data;
}
