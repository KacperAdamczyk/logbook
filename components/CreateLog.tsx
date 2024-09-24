import {
	LogForm,
	LogFormProps,
	type LogFormFieldValues,
} from "@/components/forms/LogForm";
import { getUserAircraft } from "@/db/queries/getUserAircraft";
import { getUserPilots } from "@/db/queries/getUserPilots";
import { getUserPlaces } from "@/db/queries/getUserPlaces";
import { getUserId } from "@/helpers/getUserId";
import { today } from "@internationalized/date";
import { FC } from "react";

const defaultValues = {
	date: new Date(),
	departurePlace: "",
	departureTime: null,
	arrivalPlace: "",
	arrivalTime: null,
	planeModel: "",
	planeRegistration: "",
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
	remarks: "",
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
