import { db } from "@/db";
import { isUserAllowed } from "@/db/queries/isUserAllowed";
import { accounts, sessions, users } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [GitHub],
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions,
	}),
	callbacks: {
		authorized: async ({ auth }) => !!auth,
		signIn: async ({ profile: { email } = {} }) =>
			!!email && isUserAllowed(email),
	},
});
