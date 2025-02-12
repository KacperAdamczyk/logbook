import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// biome-ignore lint/style/useNamingConvention: <explanation>
		DATABASE_URL: z.union([z.string().url(), z.literal(":memory:")]),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		DATABASE_TOKEN: z.string(),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		BETTER_AUTH_SECRET: z.string(),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		GITHUB_CLIENT_ID: z.string(),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		GITHUB_CLIENT_SECRET: z.string(),
	},
	runtimeEnv: {
		// biome-ignore lint/style/useNamingConvention: <explanation>
		DATABASE_URL: process.env.DATABASE_URL,
		// biome-ignore lint/style/useNamingConvention: <explanation>
		DATABASE_TOKEN: process.env.DATABASE_TOKEN,
		// biome-ignore lint/style/useNamingConvention: <explanation>
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		// biome-ignore lint/style/useNamingConvention: <explanation>
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		// biome-ignore lint/style/useNamingConvention: <explanation>
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	},
});
