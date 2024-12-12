import { aircraft } from "@/db/schema/aircraft";
import { logs } from "@/db/schema/logs";
import { pilots } from "@/db/schema/pilots";
import { places } from "@/db/schema/places";
import { simulators } from "@/db/schema/simulators";
import { relations } from "drizzle-orm";
import {
	primaryKey,
	sqliteTable,
	text,
	integer,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { v7 } from "uuid";

export const users = sqliteTable("users", {
	id: text().primaryKey().$defaultFn(v7),
	name: text(),
	email: text().notNull(),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text(),
});

export const accounts = sqliteTable(
	"accounts",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text().$type<AdapterAccountType>().notNull(),
		provider: text().notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		refresh_token: text("refresh_token"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		access_token: text("access_token"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		expires_at: integer("expires_at"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		token_type: text("token_type"),
		scope: text("scope"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		id_token: text("id_token"),
		// biome-ignore lint/style/useNamingConvention: <explanation>
		session_state: text("session_state"),
	},
	(account) => [
		primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	],
);

export const sessions = sqliteTable("sessions", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer({ mode: "timestamp_ms" }).notNull(),
});

export const allowedUsers = sqliteTable("allowed_users", {
	email: text().primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
	aircraft: many(aircraft),
	logs: many(logs),
	pilots: many(pilots),
	places: many(places),
	simulators: many(simulators),
}));
