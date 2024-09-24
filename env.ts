import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		// biome-ignore lint/style/useNamingConvention: <explanation>
		DATABASE_URL: z.union([z.string().url(), z.literal(":memory:")]),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		DATABASE_TOKEN: z.string(),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		AUTH_SECRET: z.string(),
	},
	// biome-ignore lint/style/useNamingConvention: <explanation>
	experimental__runtimeEnv: {},
});
