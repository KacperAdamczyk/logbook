import type { InvitationCode } from "$lib/server/db/schema/invitation-code";
import { APIError, type DBAdapter } from "better-auth";

const INVALID_INVITATION_CODE = "Invitation code is invalid";
const USED_INVITATION_CODE = "Invitation code has already been used";
const REQUIRED_INVITATION_CODE = "Invitation code is required";

export async function consumeInvitationCode(
	adapter: Pick<DBAdapter, "findOne" | "update">,
	invitationCode: string,
	userId: string,
	now = new Date(),
) {
	if (!invitationCode) {
		throw APIError.from("BAD_REQUEST", {
			message: REQUIRED_INVITATION_CODE,
			code: "INVITATION_CODE_REQUIRED",
		});
	}

	const invite = await adapter.findOne<InvitationCode>({
		model: "invitation_code",
		where: [{ field: "code", value: invitationCode }],
	});

	if (!invite) {
		throw APIError.from("BAD_REQUEST", {
			message: INVALID_INVITATION_CODE,
			code: "INVALID_INVITATION_CODE",
		});
	}

	if (invite.consumedAt) {
		throw APIError.from("BAD_REQUEST", {
			message: USED_INVITATION_CODE,
			code: "INVITATION_CODE_ALREADY_USED",
		});
	}

	const consumedInvite = await adapter.update<InvitationCode>({
		model: "invitation_code",
		where: [{ field: "id", value: invite.id }],
		update: {
			consumedAt: now,
			consumedByUserId: userId,
		},
	});

	if (!consumedInvite) {
		throw APIError.from("BAD_REQUEST", {
			message: INVALID_INVITATION_CODE,
			code: "INVALID_INVITATION_CODE",
		});
	}

	return {
		invitationId: consumedInvite.id,
		invitedAt: now,
	};
}
