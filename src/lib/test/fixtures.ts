import { test } from "vitest";
import { TransactionRollbackError } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { seed } from "drizzle-seed";
import * as schema from "$lib/server/db/schema";
import { relations } from "$lib/server/db/schema/relations";
import type { TX } from "$lib/server/db";

const db = drizzle({ connection: { url: ":memory:" }, schema, relations });
await migrate(db, { migrationsFolder: "drizzle" });
await seed(db, schema);

export const dbTest = test.extend<{ tx: TX }>({
	tx: async ({ annotate }, use) => {
		await annotate("TX");
		try {
			await db.transaction(async (tx) => {
				await use(tx);

				tx.rollback();
			});
		} catch (error) {
			if (error instanceof TransactionRollbackError) return;

			throw error;
		}
	},
});
