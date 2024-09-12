"use client";

import { deleteLogAction } from "@/actions/deleteLog";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { Button } from "@nextui-org/button";
import { IconTrash } from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { type FC, useCallback } from "react";
import { toast } from "react-toastify";

interface DeleteLogButtonProps {
	logId: string;
	redirect?: string;
}

export const DeleteLogButton: FC<DeleteLogButtonProps> = ({
	logId,
	redirect,
}) => {
	const router = useRouter();

	const { execute, isExecuting } = useAction(deleteLogAction, {
		onSuccess: ({ data }) => {
			toast.success(`Log successfully deleted`);
			toast.info(
				`${data?.recalculatedLogsCount ?? 0} additional logs recalculated`,
			);

			if (redirect) {
				router.push(redirect);
			}
		},
		onError: ({ error: { serverError } }) => {
			if (serverError) {
				toast.error(serverError);
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
