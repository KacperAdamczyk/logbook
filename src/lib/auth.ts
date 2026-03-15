import { APIError, betterAuth, getCurrentAdapter } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { consumeInvitationCode } from "$lib/server/auth/invitation-code";

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
		transaction: true,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	user: {
		additionalFields: {
			invitationCode: {
				type: "string",
				required: true,
				input: true,
			},
		},
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
	databaseHooks: {
		user: {
			create: {
				before: async (user, context) => {
					if (!context) {
						return;
					}

					const invitationCode =
						Object.hasOwn(user, "invitationCode") && typeof user.invitationCode === "string"
							? user.invitationCode
							: undefined;

					if (!invitationCode) {
						throw APIError.from("BAD_REQUEST", {
							message: "Invitation code is required",
							code: "INVITATION_CODE_REQUIRED",
						});
					}

					const adapter = await getCurrentAdapter(context.context.adapter);
					await consumeInvitationCode(adapter, invitationCode, user.id);

					return {
						data: user,
					};
				},
			},
		},
	},
	plugins: [sveltekitCookies(getRequestEvent)],
});

type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
export type SessionData = Session["session"];
