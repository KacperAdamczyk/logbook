"use client";
import { recalculateLogsAction } from "@/actions/recalculateLogs";
import { actionToast } from "@/helpers/actionToast";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { IconRefresh } from "@tabler/icons-react";
import { useAction } from "next-safe-action/hooks";
import type { FC } from "react";

export const RecalculateLogsButton: FC = () => {
	const { execute, isExecuting } = useAction(recalculateLogsAction, {
		...actionToast({
			successMessageFn: (data) =>
				`${data?.recalculatedLogsCount ?? 0} logs recalculated`,
		}),
	});

	return (
		<Tooltip content="Recalculate Logs" color="primary">
			<Button
				isIconOnly
				color="primary"
				variant="flat"
				isLoading={isExecuting}
				onPress={() => execute()}
			>
				<IconRefresh />
			</Button>
		</Tooltip>
	);
};
