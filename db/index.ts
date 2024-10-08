import { env } from "@/env";
import { drizzle } from "drizzle-orm/connect";

import * as schema from "./schema";

export const db = await drizzle("turso", {
	connection: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_TOKEN,
	},
	schema,
	casing: "snake_case",
});
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
