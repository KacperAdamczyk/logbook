import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const db = drizzle({
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN
	},
	schema
});
