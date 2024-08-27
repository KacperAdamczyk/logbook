import { Tx, db } from "@/db";

export interface DbActionIn<in Params extends {}, out Returns extends unknown> {
	(tx: Tx, params: Params): Promise<Returns>;
}

export interface DbActionOut<
	in Params extends {},
	out Returns extends unknown,
> {
	(params: Params, tx?: Tx): Promise<Returns>;
}

export function createDbAction<Params extends {}, Returns extends unknown>(
	action: DbActionIn<Params, Returns>,
): DbActionOut<Params, Returns> {
	return (params, tx) => {
		if (tx) {
			return action(tx, params);
		}

		return db.transaction((tx) => {
			return action(tx, params);
		});
	};
}
