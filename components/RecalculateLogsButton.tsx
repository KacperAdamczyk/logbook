"use client";
import { recalculateLogsAction } from "@/actions/recalculateLogs";
import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { IconRefresh } from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import type { FC } from "react";
import { toast } from "react-toastify";

export const RecalculateLogsButton: FC = () => {
	const { execute, isExecuting } = useAction(recalculateLogsAction, {
		onSuccess: ({ data }) => {
			toast.success(`${data?.recalculatedLogsCount ?? 0} logs recalculated`);
		},
		onError: ({ error: { serverError, fetchError } }) => {
			if (fetchError) {
				toast.error(fetchError);
			} else {
				toast.error(serverError);
			}
		},
	});

	return (
		<Tooltip content="Recalculate Logs" color="primary">
			<Button
				isIconOnly
				color="primary"
				variant="flat"
				isLoading={isExecuting}
				onClick={() => execute()}
			>
				<IconRefresh />
			</Button>
		</Tooltip>
	);
};
