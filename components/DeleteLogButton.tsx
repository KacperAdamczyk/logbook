"use client";

import { deleteLogAction } from "@/actions/deleteLog";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { actionToast } from "@/helpers/actionToast";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { Button } from "@heroui/button";
import { IconTrash } from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { type FC, useCallback } from "react";
import { toast } from "sonner";

interface DeleteLogButtonProps {
	logId: string;
	redirect?: string;
}

const toasts = actionToast({
	successMessageFn: () => "Log successfully deleted",
});

export const DeleteLogButton: FC<DeleteLogButtonProps> = ({
	logId,
	redirect,
}) => {
	const router = useRouter();

	const { execute, isExecuting } = useAction(deleteLogAction, {
		...toasts,
		onSuccess: ({ data }) => {
			toasts.onSuccess({ data });

			if (data?.recalculatedLogsCount && data.recalculatedLogsCount > 0) {
				toast.info(
					`${data?.recalculatedLogsCount} additional logs recalculated`,
				);
			}

			if (redirect) {
				router.push(redirect);
			}
		},
	});

	const { requestConfirmation, modal } = useConfirmationModal(
		useCallback(() => {
			execute({ logId });
		}, [execute, logId]),
	);

	return (
		<>
			<Button
				isIconOnly
				variant="flat"
				color="danger"
				onPress={requestConfirmation}
				isLoading={isExecuting}
			>
				<IconTrash />
			</Button>
			<ConfirmationModal {...modal} confirmText="Delete">
				Are you sure you want to delete this log?
			</ConfirmationModal>
		</>
	);
};
