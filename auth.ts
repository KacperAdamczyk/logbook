import { db } from "@/db";
import { createSelfAsPilot } from "@/db/actions";
import { isUserAllowed } from "@/db/queries/isUserAllowed";
import { accounts, sessions, users } from "@/db/schema/auth";
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
	events: {
		createUser: async ({ user: { id } }) => {
			if (id) {
				await createSelfAsPilot(id);
			}
		},
	},
});
