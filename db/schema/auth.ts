import { aircraft } from "@/db/schema/aircraft";
import { log } from "@/db/schema/log";
import { pilot } from "@/db/schema/pilot";
import { place } from "@/db/schema/place";
import { simulator } from "@/db/schema/simulator";
import { relations } from "drizzle-orm";
import {
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { v7 } from "uuid";

export const user = sqliteTable("user", {
	id: text().primaryKey().$defaultFn(v7),
	name: text(),
	email: text().notNull(),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text(),
});

export const account = sqliteTable(
	"account",
	{
		userId: text("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
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

export const session = sqliteTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	expires: integer({ mode: "timestamp_ms" }).notNull(),
});

export const allowedUser = sqliteTable("allowedUser", {
	email: text().primaryKey(),
});

export const userRelations = relations(user, ({ many }) => ({
	aircraft: many(aircraft),
	logs: many(log),
	pilots: many(pilot),
	places: many(place),
	simulators: many(simulator),
}));
