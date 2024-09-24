import { LogForm, type LogFormProps } from "@/components/forms/LogForm";
import { db } from "@/db";
import { getUserAircraft } from "@/db/queries/getUserAircraft";
import { getUserPilots } from "@/db/queries/getUserPilots";
import { getUserPlaces } from "@/db/queries/getUserPlaces";
import { formatMinutes } from "@/helpers/formatMinutes";
import { getUserId } from "@/helpers/getUserId";
import {
	CalendarDate,
	Time,
	fromDate,
	parseTime,
} from "@internationalized/date";
import { notFound } from "next/navigation";
import type { FC } from "react";

const formatTime = (time: number) =>
	time ? parseTime(formatMinutes(time)).toString() : "";

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
	).toString();
	const departureTime = new Time(
		departureDate.hour,
		departureDate.minute,
	).toString();
	const arrivalTime = new Time(arrivalDate.hour, arrivalDate.minute).toString();

	const defaultValues = {
		date,
		departurePlace: log.departurePlace.name,
		departureTime,
		arrivalPlace: log.arrivalPlace.name,
		arrivalTime,
		planeModel: log.aircraft.model,
		planeRegistration: log.aircraft.registration,
		engineType: log.singularTimes.multiPilot ? "multi" : "single",
		singlePilotTimeSingleEngine: formatTime(
			log.singularTimes.singlePilotSingleEngine,
		),
		singlePilotTimeMultiEngine: formatTime(
			log.singularTimes.singlePilotMultiEngine,
		),
		multiPilotTime: formatTime(log.singularTimes.multiPilot),
		totalFlightTime: formatTime(log.singularTimes.totalFlight),
		pilotInCommand: log.pilotInCommand.name,
		takeoffsDay: log.takeoffsDay?.toString() ?? "",
		takeoffsNight: log.takeoffsNight?.toString() ?? "",
		landingsDay: log.landingsDay?.toString() ?? "",
		landingsNight: log.landingsNight?.toString() ?? "",
		operationalConditionTimeNight: formatTime(
			log.singularTimes.operationalConditionNight,
		),
		operationalConditionTimeIfr: formatTime(
			log.singularTimes.operationalConditionIfr,
		),
		functionTimePilotInCommand: formatTime(
			log.singularTimes.functionPilotInCommand,
		),
		functionTimeCoPilot: formatTime(log.singularTimes.functionCoPilot),
		functionTimeDual: formatTime(log.singularTimes.functionDual),
		functionTimeInstructor: formatTime(log.singularTimes.functionInstructor),
		remarks: log.remarks ?? "",
	} satisfies LogFormProps["defaultValues"];

	return (
		<LogForm
			defaultValues={defaultValues}
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
