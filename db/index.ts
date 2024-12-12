import { env } from "@/env";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

export const db = drizzle({
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_TOKEN,
	},
	schema,
	casing: "snake_case",
});

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
