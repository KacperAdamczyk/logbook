import { db } from "@/db";
import { createLog } from "@/db/actions";
import { users } from "@/db/schema";
import { user1 } from "@/tests/test-data";
import { beforeEach, describe, expect, test } from "vitest";

describe("createLog", () => {
	beforeEach(async () => {
		await db.batch([db.insert(users).values([user1])]);
	});

	test("should create a log", async () => {
		const log = await createLog({}, {});

		expect(log).toHaveLength(1);
	});
});
