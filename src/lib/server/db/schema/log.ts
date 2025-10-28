import { flightLog } from '$lib/server/db/schema/flightLog';
import { simulatorLog } from '$lib/server/db/schema/simulatorLog';
import { sqliteView, unionAll } from 'drizzle-orm/sqlite-core';

export const logView = sqliteView('log_view').as((qb) =>
	unionAll(qb.select({}).from(flightLog), qb.select({}).from(simulatorLog))
);
