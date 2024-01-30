import { serverSchema } from './schema.js';
import dotenv from 'dotenv';
dotenv.config({
  path: '.env.local',
});

const _serverEnv = serverSchema.safeParse(process.env);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  errors: import('zod').ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if ('_errors' in value) {
        return `${name}: ${value._errors.join(', ')}\n`;
      }
    })
    .filter(Boolean);

if (!_serverEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_serverEnv.error.format())
  );
  throw new Error('Invalid environment variables');
}

/**
 * Validate that server-side environment variables are not exposed to the client.
 */
for (const key of Object.keys(_serverEnv.data)) {
  if (key.startsWith('NEXT_PUBLIC_')) {
    console.warn('❌ You are exposing a server-side env-variable:', key);

    throw new Error('You are exposing a server-side env-variable');
  }
}

export const env = { ..._serverEnv.data };
