import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const test = sqliteTable('test', {
	id: text('id').primaryKey(),
	age: integer('age')
});
