import { createLog } from "@/db/actions";
import { describe, expect, test } from "vitest";

describe("createLog", () => {
	test("should create a log", async () => {
		const log = await createLog({}, {});

		console.log(log);

		expect(log).toBeDefined();
	});
});
