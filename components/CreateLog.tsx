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
	departurePlace: null,
	departureTime: null,
	arrivalPlace: null,
	arrivalTime: null,
	planeModel: null,
	planeRegistration: null,
	engineType: "single",
	singlePilotTimeSingleEngine: null,
	singlePilotTimeMultiEngine: null,
	multiPilotTime: null,
	totalFlightTime: null,
	pilotInCommand: "",
	takeoffsDay: null,
	takeoffsNight: null,
	landingsDay: null,
	landingsNight: null,
	operationalConditionTimeNight: null,
	operationalConditionTimeIfr: null,
	functionTimePilotInCommand: null,
	functionTimeCoPilot: null,
	functionTimeDual: null,
	functionTimeInstructor: null,
	remarks: null,
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
			aircraft={aircraft}
			pilots={pilots}
			places={places}
			onSuccessToast="Log created successfully"
			onSuccessRedirect={onSuccessRedirect}
		/>
	);
};
