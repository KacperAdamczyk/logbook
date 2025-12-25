import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: ["./src/lib/server/db/schema/*"],
	dialect: "turso",
	dbCredentials: { url: process.env.DATABASE_URL! },
	verbose: true,
	strict: true,
});
