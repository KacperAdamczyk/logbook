import { LogForm, type LogFormProps } from "@/components/forms/LogForm";
import { db } from "@/db";
import { getUserAircraft } from "@/db/queries/getUserAircraft";
import { getUserPilots } from "@/db/queries/getUserPilots";
import { getUserPlaces } from "@/db/queries/getUserPlaces";
import { getUserId } from "@/helpers/getUserId";
import { minutesToTime } from "@/helpers/minutesToTime";
import type { TimeValue } from "@/types/TimeValue";
import { CalendarDate, fromDate } from "@internationalized/date";
import { notFound } from "next/navigation";
import type { FC } from "react";

interface Props extends Pick<LogFormProps, "onSuccessRedirect"> {
	logId: string;
}

export const UpdateLog: FC<Props> = async ({ logId, onSuccessRedirect }) => {
	const userId = await getUserId();

	const [aircraft, pilots, places, log] = await Promise.all([
		getUserAircraft({ userId }),
		getUserPilots({ userId }),
		getUserPlaces({ userId }),
		db.query.logs.findFirst({
			where: (logs, { and, eq }) =>
				and(eq(logs.userId, userId), eq(logs.id, logId)),
			with: {
				departurePlace: true,
				arrivalPlace: true,
				aircraft: true,
				pilotInCommand: true,
				singularTimes: true,
			},
		}),
	]);

	if (!log) {
		notFound();
	}

	const departureDate = fromDate(log.departureAt, "utc");
	const arrivalDate = fromDate(log.arrivalAt, "utc");
	const date = new CalendarDate(
		departureDate.year,
		departureDate.month,
		departureDate.day,
	).toDate("utc");
	const departureTime = {
		hour: departureDate.hour,
		minute: departureDate.minute,
	} satisfies TimeValue;
	const arrivalTime = {
		hour: arrivalDate.hour,
		minute: arrivalDate.minute,
	} satisfies TimeValue;

	const defaultValues = {
		date,
		departurePlace: log.departurePlace.name,
		departureTime,
		arrivalPlace: log.arrivalPlace.name,
		arrivalTime,
		planeModel: log.aircraft.model,
		planeRegistration: log.aircraft.registration,
		engineType: log.singularTimes.multiPilot ? "multi" : "single",
		singlePilotTimeSingleEngine: minutesToTime(
			log.singularTimes.singlePilotSingleEngine,
		),
		singlePilotTimeMultiEngine: minutesToTime(
			log.singularTimes.singlePilotMultiEngine,
		),
		multiPilotTime: minutesToTime(log.singularTimes.multiPilot),
		totalFlightTime: minutesToTime(log.singularTimes.totalFlight),
		pilotInCommand: log.pilotInCommand.name,
		takeoffsDay: log.takeoffsDay,
		takeoffsNight: log.takeoffsNight,
		landingsDay: log.landingsDay,
		landingsNight: log.landingsNight,
		operationalConditionTimeNight: minutesToTime(
			log.singularTimes.operationalConditionNight,
		),
		operationalConditionTimeIfr: minutesToTime(
			log.singularTimes.operationalConditionIfr,
		),
		functionTimePilotInCommand: minutesToTime(
			log.singularTimes.functionPilotInCommand,
		),
		functionTimeCoPilot: minutesToTime(log.singularTimes.functionCoPilot),
		functionTimeDual: minutesToTime(log.singularTimes.functionDual),
		functionTimeInstructor: minutesToTime(log.singularTimes.functionInstructor),
		remarks: log.remarks,
	} satisfies LogFormProps["initialValues"];

	return (
		<LogForm
			initialValues={defaultValues}
			submitLabel="Edit Log"
			action="edit"
			aircraft={aircraft}
			pilots={pilots}
			places={places}
			onSuccessToast="Log edited successfully"
			onSuccessRedirect={onSuccessRedirect}
		/>
	);
};
