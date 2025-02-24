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
		// biome-ignore lint/style/useNamingConvention: <explanation>
		GITHUB_REDIRECT_URI: z.union([z.string().url(), z.undefined()]),
	},
	// biome-ignore lint/style/useNamingConvention: <explanation>
	experimental__runtimeEnv: {},
	skipValidation: !!process.env.CI,
});
