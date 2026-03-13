import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";

const getBaseUrl = () => {
	if (env.BETTER_AUTH_URL) {
		return env.BETTER_AUTH_URL;
	}
	if (env.VERCEL_URL) {
		return `https://${env.VERCEL_URL}`;
	}

	throw new Error("Base URL is not defined. Please set BETTER_AUTH_URL or deploy to Vercel.");
};

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ url, user, token }) => {
			console.log(`Email verification for ${user.email}:`);
			console.log(url);
			console.log(token);
		},
		afterEmailVerification: async ({ email }) => {
			console.log(`Email verification successful for ${email}`);
		},
		sendOnSignUp: true,
		sendOnSignIn: true,
	},
	baseURL: getBaseUrl(),
	trustedOrigins: [
		"http://localhost:5173",
		"https://*-kacper-adamczyk-projects.vercel.app",
		"https://fly-logbook.vercel.app",
	],
	plugins: [sveltekitCookies(getRequestEvent)],
});

type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
export type SessionData = Session["session"];
