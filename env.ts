import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.union([z.string().url(), z.literal(":memory:")]),
		AUTH_SECRET: z.string(),
	},
	experimental__runtimeEnv: {},
});
