import { APIError, type DBAdapter } from "better-auth";
import { describe, expect, it, vi } from "vitest";
import { consumeInvitationCode } from "./invitation-code";

const createAdapter = () =>
	({
		findOne: vi.fn(),
		update: vi.fn(),
	}) as unknown as Pick<DBAdapter, "findOne" | "update">;

describe("invitation-code", () => {
	it("consumes a valid invitation code", async () => {
		const adapter = createAdapter();
		const now = new Date("2026-03-15T10:00:00.000Z");

		vi.mocked(adapter.findOne).mockResolvedValue({
			id: "invite_1",
			code: "CODE-123",
			isConsumed: false,
			consumedAt: null,
			consumedByUserId: null,
		});
		vi.mocked(adapter.update).mockResolvedValue({
			id: "invite_1",
			code: "CODE-123",
			isConsumed: true,
			consumedAt: now,
			consumedByUserId: "user_1",
		});

		await expect(
			consumeInvitationCode(adapter as unknown as DBAdapter, " CODE-123 ", "user_1", now),
		).resolves.toEqual({
			invitationId: "invite_1",
			invitedAt: now,
		});

		expect(adapter.findOne).toHaveBeenCalledWith({
			model: "invitation_code",
			where: [{ field: "code", value: "CODE-123" }],
		});
		expect(adapter.update).toHaveBeenCalledWith({
			model: "invitation_code",
			where: [
				{ field: "id", value: "invite_1" },
				{ field: "isConsumed", value: false },
			],
			update: {
				isConsumed: true,
				consumedAt: now,
				consumedByUserId: "user_1",
			},
		});
	});

	it("rejects a missing invitation code", async () => {
		const adapter = createAdapter();

		await expect(
			consumeInvitationCode(adapter as unknown as DBAdapter, "   ", "user_1"),
		).rejects.toMatchObject({
			message: "Invitation code is required",
		} satisfies Partial<APIError>);

		expect(adapter.findOne).not.toHaveBeenCalled();
	});

	it("rejects an invalid invitation code", async () => {
		const adapter = createAdapter();

		vi.mocked(adapter.findOne).mockResolvedValue(null);

		await expect(
			consumeInvitationCode(adapter as unknown as DBAdapter, "CODE-123", "user_1"),
		).rejects.toMatchObject({
			message: "Invitation code is invalid",
		} satisfies Partial<APIError>);

		expect(adapter.update).not.toHaveBeenCalled();
	});

	it("rejects an already used invitation code", async () => {
		const adapter = createAdapter();

		vi.mocked(adapter.findOne).mockResolvedValue({
			id: "invite_1",
			code: "CODE-123",
			isConsumed: true,
			consumedAt: new Date("2026-03-15T09:00:00.000Z"),
			consumedByUserId: "user_1",
		});

		await expect(
			consumeInvitationCode(adapter as unknown as DBAdapter, "CODE-123", "user_2"),
		).rejects.toMatchObject({
			message: "Invitation code has already been used",
		} satisfies Partial<APIError>);

		expect(adapter.update).not.toHaveBeenCalled();
	});

	it("rejects when another signup consumes the code first", async () => {
		const adapter = createAdapter();

		vi.mocked(adapter.findOne).mockResolvedValue({
			id: "invite_1",
			code: "CODE-123",
			isConsumed: false,
			consumedAt: null,
			consumedByUserId: null,
		});
		vi.mocked(adapter.update).mockResolvedValue(null);

		await expect(
			consumeInvitationCode(adapter as unknown as DBAdapter, "CODE-123", "user_2"),
		).rejects.toMatchObject({
			message: "Invitation code has already been used",
		} satisfies Partial<APIError>);
	});
});
