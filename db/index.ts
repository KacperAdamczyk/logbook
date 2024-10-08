import { env } from "@/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const sql = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_TOKEN,
});

export const db = drizzle(sql, { schema, casing: "snake_case" });

// export const db = await drizzle("turso", {
// 	connection: {
// 		url: env.DATABASE_URL,
// 		authToken: env.DATABASE_TOKEN,
// 	},
// 	schema,
// 	casing: "snake_case",
// });
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
