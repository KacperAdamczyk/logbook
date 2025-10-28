import type { DB, TX } from '$lib/server/db';

export interface DbAction<Args extends unknown[], Return> {
	(db: DB | TX, ...args: Args): Promise<Return>;
}

export const createDbAction = <Args extends unknown[], Return>(
	action: DbAction<Args, Return>
): DbAction<Args, Return> => action;
