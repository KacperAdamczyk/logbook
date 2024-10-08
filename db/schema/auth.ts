import { aircraft } from "@/db/schema/aircraft";
import { logs } from "@/db/schema/logs";
import { pilots } from "@/db/schema/pilots";
import { places } from "@/db/schema/places";
import { simulators } from "@/db/schema/simulators";
import { relations } from "drizzle-orm";
import { primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { v7 } from "uuid";

export const users = sqliteTable("users", (t) => ({
	id: t.text().primaryKey().$defaultFn(v7),
	name: t.text(),
	email: t.text().notNull(),
	emailVerified: t.integer("emailVerified", { mode: "timestamp_ms" }),
	image: t.text(),
}));

export const accounts = sqliteTable(
	"accounts",
	(t) => ({
		userId: t
			.text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: t.text().$type<AdapterAccountType>().notNull(),
		provider: t.text().notNull(),
		providerAccountId: t.text("providerAccountId").notNull(),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		refresh_token: t.text("refresh_token"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		access_token: t.text("access_token"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		expires_at: t.integer("expires_at"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		token_type: t.text("token_type"),
		scope: t.text("scope"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		id_token: t.text("id_token"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		session_state: t.text("session_state"),
	}),
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = sqliteTable("sessions", (t) => ({
	sessionToken: t.text("sessionToken").primaryKey(),
	userId: t
		.text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: t.integer({ mode: "timestamp_ms" }).notNull(),
}));

export const allowedUsers = sqliteTable("allowed_users", (t) => ({
	email: t.text().primaryKey(),
}));

export const usersRelations = relations(users, ({ many }) => ({
	aircraft: many(aircraft),
	logs: many(logs),
	pilots: many(pilots),
	places: many(places),
	simulators: many(simulators),
}));
