import { test } from 'vitest';
import { TransactionRollbackError } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { seed } from 'drizzle-seed';
import * as schema from '$lib/server/db/schema';
import type { TX } from '$lib/server/db';

const db = drizzle({ connection: { url: ':memory:' }, schema });
await migrate(db, { migrationsFolder: 'drizzle' });
// @ts-expect-error - This is going to be fixed in the next drizzle-orm release
await seed(db, schema);

export const dbTest = test.extend<{ tx: TX }>({
	tx: async ({ annotate }, use) => {
		await annotate('TX');
		try {
			await db.transaction(async (tx) => {
				await use(tx);

				tx.rollback();
			});
		} catch (error) {
			if (error instanceof TransactionRollbackError) return;

			throw error;
		}
	}
});
