import { test } from 'vitest';
import { drizzle } from 'drizzle-orm/libsql';
import { seed } from 'drizzle-seed';
import * as schema from '$lib/server/db/schema';
import type { TX } from '$lib/server/db';

const db = drizzle({ connection: { url: ':memory:' }, schema });
// @ts-expect-error - This is going to be fixed in the next drizzle-orm release
await seed(db, schema);

export const dbTest = test.extend<{ tx: TX }>({
	tx: (_, use) => {
		return db.transaction(async (tx) => {
			await use(tx);

			tx.rollback();
		});
	}
});
