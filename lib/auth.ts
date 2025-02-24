import { db } from "@/db";
import { env } from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oAuthProxy } from "better-auth/plugins";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "sqlite" }),
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			// biome-ignore lint/style/useNamingConvention: <explanation>
			redirectURI: env.GITHUB_REDIRECT_URI,
		},
	},
	plugins: [nextCookies(), oAuthProxy()],
});
