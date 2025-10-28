import { flightLog } from './flight-log';
import { simulatorLog } from './simulator-log';
import { sqliteView, unionAll } from 'drizzle-orm/sqlite-core';

export const logView = sqliteView('log_view').as((qb) =>
	unionAll(
		qb.select({ id: flightLog.id }).from(flightLog),
		qb.select({ id: simulatorLog.id }).from(simulatorLog)
	)
);
