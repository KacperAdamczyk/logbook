import { env } from "@/env";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import * as schema from "./schema";

const sql = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_TOKEN,
});
const db = drizzle(sql, { schema });

export { db };
