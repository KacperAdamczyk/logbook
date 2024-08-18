import { aircraft } from "@/db/schema/aircraft";
import { logs } from "@/db/schema/logs";
import { pilots } from "@/db/schema/pilots";
import { places } from "@/db/schema/places";
import { simulators } from "@/db/schema/simulators";
import { relations } from "drizzle-orm";
import {
	integer,
	sqliteTable,
	primaryKey,
	text,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { v7 } from "uuid";

export const users = sqliteTable("users", {
	id: text("id").primaryKey().$defaultFn(v7),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text("image"),
});

export const accounts = sqliteTable(
	"accounts",
	{
		userId: text("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccountType>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	}),
);

export const sessions = sqliteTable("sessions", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const allowedUsers = sqliteTable("allowed_users", {
	email: text("email").primaryKey(),
});

export const usersRelations = relations(users, ({ many }) => ({
	aircraft: many(aircraft),
	logs: many(logs),
	pilots: many(pilots),
	places: many(places),
	simulators: many(simulators),
}));
