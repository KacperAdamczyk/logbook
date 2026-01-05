import { drizzle } from "drizzle-orm/libsql";
import * as schema from "$lib/server/db/schema";
import { relations } from "$lib/server/db/schema/relations";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export const db = drizzle({
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_AUTH_TOKEN,
	},
	schema,
	relations,
});

export type DB = typeof db;
export type TX = Parameters<Parameters<DB["transaction"]>[0]>[0];
