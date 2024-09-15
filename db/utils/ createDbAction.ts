import { type Tx, db } from "@/db";

export type DbActionIn<in Params extends {}, out Returns> = (
	tx: Tx,
	params: Params,
) => Promise<Returns>;

export type DbActionOut<in Params extends {}, out Returns> = (
	params: Params,
	tx?: Tx,
) => Promise<Returns>;

export function createDbAction<Params extends {}, Returns>(
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
