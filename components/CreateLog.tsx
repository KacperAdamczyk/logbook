import {
	LogForm,
	type LogFormFieldValues,
	type LogFormProps,
} from "@/components/forms/LogForm";
import { getUserAircraft } from "@/db/queries/getUserAircraft";
import { getUserPilots } from "@/db/queries/getUserPilots";
import { getUserPlaces } from "@/db/queries/getUserPlaces";
import { getUserId } from "@/helpers/getUserId";
import type { FC } from "react";

const initialValues = {
	date: new Date(),
	departurePlace: "",
	departureTime: undefined,
	arrivalPlace: "",
	arrivalTime: undefined,
	planeModel: "",
	planeRegistration: "",
	engineType: "single",
	singlePilotTimeSingleEngine: undefined,
	singlePilotTimeMultiEngine: undefined,
	multiPilotTime: undefined,
	totalFlightTime: undefined,
	pilotInCommand: "",
	takeoffsDay: undefined,
	takeoffsNight: undefined,
	landingsDay: undefined,
	landingsNight: undefined,
	operationalConditionTimeNight: undefined,
	operationalConditionTimeIfr: undefined,
	functionTimePilotInCommand: undefined,
	functionTimeCoPilot: undefined,
	functionTimeDual: undefined,
	functionTimeInstructor: undefined,
	remarks: undefined,
} satisfies LogFormFieldValues;

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
			initialValues={initialValues}
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
