import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ url, user, token }, request) => {
			const origin = request ? `${new URL(request.url).origin}/api/auth` : "";
			console.log(`Email verification for ${user.email}:`);
			console.log(`URL: ${origin}${url}`);
			console.log(`Token: ${token}`);
		},
		afterEmailVerification: async ({ email }) => {
			console.log(`Email verification successful for ${email}`);
		},
		sendOnSignUp: true,
		sendOnSignIn: true,
	},
	trustedOrigins: ["http://localhost:5173", "https://*.-kacper-adamczyk-projects.vercel.app"],
	plugins: [sveltekitCookies(getRequestEvent)],
});

type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
export type SessionData = Session["session"];
