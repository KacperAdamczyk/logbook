import { integer, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const commonFields = {
	id: text().primaryKey().$defaultFn(nanoid),
	createdAt: integer({ mode: 'timestamp_ms' })
		.notNull()
		.$default(() => new Date()),
	updatedAt: integer({ mode: 'timestamp_ms' })
		.notNull()
		.$default(() => new Date())
		.$onUpdate(() => new Date())
} as const;
