import { user } from "./auth";
import { commonFields } from "../helpers";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const simulatorLog = sqliteTable("simulator_log", {
	...commonFields,
	userId: text()
		.notNull()
		.references(() => user.id),
	date: integer({ mode: "timestamp_ms" }).notNull(),
	type: text().notNull(),
	totalTime: integer().notNull(),
	remarks: text().notNull(),
});
