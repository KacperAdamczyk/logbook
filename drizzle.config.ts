import { env } from "@/env";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
	schema: "./db/schema/*",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
