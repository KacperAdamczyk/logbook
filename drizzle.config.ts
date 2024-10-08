import { env } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./db/schema/*",
	out: "./drizzle",
	dialect: "turso",
	dbCredentials: {
		url: env.DATABASE_URL,
		authToken: env.DATABASE_TOKEN,
	},
	verbose: true,
	strict: true,
	casing: "snake_case",
});
