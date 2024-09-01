import { auth } from "@/auth";
import { LogDetails } from "@/components/LogDetails";
import { db } from "@/db";
import { notFound } from "next/navigation";

interface Props {
	params: {
		logId: string;
	};
}

export default async function LogPage({ params: { logId } }: Props) {
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		notFound();
	}

	const log = await db.query.logs.findFirst({
		where: (logs, { eq, and }) =>
			and(eq(logs.userId, userId), eq(logs.id, logId)),
		with: {
			singularTimes: true,
			cumulatedTimes: true,
			aircraft: true,
			pilotInCommand: true,
			departurePlace: true,
			arrivalPlace: true,
		},
	});

	if (!log) {
		notFound();
	}

	return (
		<section>
			<h1 className="text-xl text-center mb-2">Log</h1>
			<LogDetails log={log} />
		</section>
	);
}
