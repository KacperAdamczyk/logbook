import { drizzle, type LibSQLTransaction } from "drizzle-orm/libsql";
import * as schema from "$lib/server/db/schema";

import { env } from "$env/dynamic/private";
import type { ExtractTablesWithRelations } from "drizzle-orm";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const db = drizzle({
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
	schema,
});

export type DB = typeof db;
export type TX = LibSQLTransaction<typeof schema, ExtractTablesWithRelations<typeof schema>>;
