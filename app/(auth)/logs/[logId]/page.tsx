import { DeleteLogButton } from "@/components/DeleteLogButton";
import { LogDetails } from "@/components/LogDetails";
import { Button } from "@heroui/button";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
	params: Promise<{
		logId: string;
	}>;
}

export default async function LogPage(props: Props) {
	const params = await props.params;

	const { logId } = params;

	return (
		<section className="flex flex-col gap-2">
			<div className="flex gap-1 justify-center items-center">
				<h1 className="text-xl text-center grow">Log</h1>
				<DeleteLogButton logId={logId} redirect="/" />
				<Button
					as={Link}
					href={`/logs/${logId}/edit`}
					isIconOnly
					variant="flat"
					color="warning"
				>
					<IconEdit />
				</Button>
			</div>
			<LogDetails logId={logId} />
		</section>
	);
}
