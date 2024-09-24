import { DeleteLogButton } from "@/components/DeleteLogButton";
import { LogDetails } from "@/components/LogDetails";
import { Button } from "@nextui-org/button";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";

interface Props {
	params: {
		logId: string;
	};
}

export default function LogPage({ params: { logId } }: Props) {
	return (
		<section className="flex flex-col gap-2">
			<div className="flex justify-center items-center">
				<h1 className="text-xl text-center grow">Log</h1>
				<DeleteLogButton logId={logId} redirect="/" />
				<Button as={Link} href={`/logs/${logId}/edit`} isIconOnly>
					<IconEdit />
				</Button>
			</div>
			<LogDetails logId={logId} />
		</section>
	);
}
