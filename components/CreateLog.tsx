import { createLogAction } from "@/actions/createLog";
import { auth } from "@/auth";
import { LogForm, LogFormProps } from "@/components/forms/LogForm";
import { getUserAircraft } from "@/db/queries/getUserAircraft";
import { getUserPilots } from "@/db/queries/getUserPilots";
import { getUserPlaces } from "@/db/queries/getUserPlaces";
import { today } from "@internationalized/date";
import { notFound } from "next/navigation";
import { FC } from "react";

const defaultValues = {
	date: today("utc").toString(),
	engineType: "single",
} satisfies LogFormProps["defaultValues"];

export const CreateLog: FC = async () => {
	const session = await auth();

	if (!session?.user?.id) {
		notFound();
	}
	const userId = session.user.id;

	const [aircraft, pilots, places] = await Promise.all([
		getUserAircraft({ userId }),
		getUserPilots({ userId }),
		getUserPlaces({ userId }),
	]);

	return (
		<section>
			<h1 className="text-xl text-center mb-2">Create New Log</h1>
			<LogForm
				defaultValues={defaultValues}
				submitLabel="Create Log"
				action={createLogAction}
				aircraft={aircraft}
				pilots={pilots}
				places={places}
				onSuccessToast="Log created successfully"
				onSuccessRedirect="/"
			/>
		</section>
	);
};
