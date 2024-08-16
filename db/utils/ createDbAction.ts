import type { User } from "next-auth";

export interface DbAction<in Params extends {}, out Returns extends unknown> {
	(user: User, params: Params): Promise<Returns>;
}

export function createDbAction<Params extends {}, Returns extends unknown>(
	action: DbAction<Params, Returns>,
): DbAction<Params, Returns> {
	return action;
}
