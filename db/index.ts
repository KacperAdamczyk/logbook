import { env } from "@/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const sql = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_TOKEN,
});

export const db = drizzle(sql, { schema });
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
