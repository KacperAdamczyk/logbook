import { env } from "@/env";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
	schema: "./db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
