import { user } from "./auth";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";
import { nanoid } from "nanoid";

export const invitationCode = sqliteTable("invitation_code", {
	id: text("id").primaryKey().$defaultFn(nanoid),
	code: text("code").notNull().unique().$defaultFn(nanoid),
	consumedAt: integer("consumed_at", { mode: "timestamp_ms" }),
	consumedByUserId: text("consumed_by_user_id").references(() => user.id),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$default(() => new Date()),
});

export type InvitationCode = InferSelectModel<typeof invitationCode>;
