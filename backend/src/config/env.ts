import { configDotenv } from 'dotenv';
import { z, type ZodType } from 'zod';

configDotenv({ quiet: true });

export const NODE_ENV = validEnv(
  'NODE_ENV',
  z.enum(['development', 'production', 'test']),
);
export const PORT = validEnv('PORT', z.coerce.number().default(3000));
export const MONGODB_URI = validEnv('MONGODB_URI', z.string().nonempty());
export const JWT_EXPIRES_IN = validEnv('JWT_EXPIRES_IN', z.string().nonempty());
export const JWT_SECRET = validEnv('JWT_SECRET', z.string().nonempty());

function validEnv<TOutput>(
  variable: string,
  schema: ZodType<TOutput>,
): TOutput {
  const result = schema.safeParse(process.env[variable]);

  if (!result.success) {
    throw new Error(`Invalid environment variable: ${result.error.message}`);
  }

  return result.data;
}
