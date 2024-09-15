import { LogForm, type LogFormProps } from "@/components/forms/LogForm";
import { getUserAircraft } from "@/db/queries/getUserAircraft";
import { getUserPilots } from "@/db/queries/getUserPilots";
import { getUserPlaces } from "@/db/queries/getUserPlaces";
import { getUserId } from "@/helpers/getUserId";
import { today } from "@internationalized/date";
import type { FC } from "react";

const defaultValues = {
	date: today("utc").toString(),
	engineType: "single",
} satisfies LogFormProps["defaultValues"];

interface Props extends Pick<LogFormProps, "onSuccessRedirect"> {}

export const CreateLog: FC<Props> = async ({ onSuccessRedirect }) => {
	const userId = await getUserId();

	const [aircraft, pilots, places] = await Promise.all([
		getUserAircraft({ userId }),
		getUserPilots({ userId }),
		getUserPlaces({ userId }),
	]);

	return (
		<LogForm
			defaultValues={defaultValues}
			submitLabel="Create Log"
			action="create"
			aircraft={aircraft}
			pilots={pilots}
			places={places}
			onSuccessToast="Log created successfully"
			onSuccessRedirect={onSuccessRedirect}
		/>
	);
};
