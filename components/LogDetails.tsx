import { db } from "@/db";
import type { Time } from "@/db/schema";
import { formatMinutes } from "@/helpers/formatMinutes";
import { getUserId } from "@/helpers/getUserId";
import { fromDate, toCalendarDate, toTime } from "@internationalized/date";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { cn } from "@nextui-org/react";
import { notFound } from "next/navigation";
import type { FC } from "react";

interface Props {
	logId: string;
}

const DetailRow: FC<{
	label: string;
	value: string | number;
	className?: string;
}> = ({ label, value, className }) => (
	<div className={cn("flex justify-between", className)}>
		<span className="text-default-500">{label}</span>
		<span>{value}</span>
	</div>
);

const TimeDetails: FC<{ title: string; times: Time }> = ({
	title,
	times: {
		singlePilotSingleEngine,
		singlePilotMultiEngine,
		multiPilot,
		operationalConditionNight,
		operationalConditionIfr,
		functionPilotInCommand,
		functionCoPilot,
		functionDual,
		functionInstructor,
		totalFlight,
	},
}) => (
	<Card>
		<CardHeader>{title}</CardHeader>
		<CardBody className="grid grid-rows-10 sm:grid-rows-5 gap-x-8 gap-y-2 grid-flow-col">
			<DetailRow
				label="Single Pilot Single Engine"
				value={formatMinutes(singlePilotSingleEngine)}
			/>
			<DetailRow
				label="Single Pilot Multi Engine"
				value={formatMinutes(singlePilotMultiEngine)}
			/>
			<DetailRow label="Multi Pilot" value={formatMinutes(multiPilot)} />
			<DetailRow
				label="Operational Condition Night"
				value={formatMinutes(operationalConditionNight)}
			/>
			<DetailRow
				label="Operational Condition IFR"
				value={formatMinutes(operationalConditionIfr)}
			/>
			<DetailRow
				label="Function Pilot In Command"
				value={formatMinutes(functionPilotInCommand)}
			/>
			<DetailRow
				label="Function Co Pilot"
				value={formatMinutes(functionCoPilot)}
			/>
			<DetailRow label="Function Dual" value={formatMinutes(functionDual)} />
			<DetailRow
				label="Function Instructor"
				value={formatMinutes(functionInstructor)}
			/>
			<DetailRow label="Total Flight" value={formatMinutes(totalFlight)} />
		</CardBody>
	</Card>
);

export const LogDetails: FC<Props> = async ({ logId }) => {
	const userId = await getUserId();

	const log = await db.query.log.findFirst({
		where: (log, { eq, and }) => and(eq(log.userId, userId), eq(log.id, logId)),
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

	const {
		departureAt,
		arrivalAt,
		departurePlace,
		arrivalPlace,
		pilotInCommand,
		aircraft,
		singularTimes,
		cumulatedTimes,
		takeoffsDay,
		takeoffsNight,
		landingsDay,
		landingsNight,
		remarks,
	} = log;

	const departureDate = fromDate(departureAt, "utc");
	const arrivalDate = fromDate(arrivalAt, "utc");
	const date = toCalendarDate(departureDate);
	const departureTime = toTime(departureDate);
	const arrivalTime = toTime(arrivalDate);

	const departure = `${departurePlace.name} ${departureTime.toString().slice(0, 5)}`;
	const arrival = `${arrivalPlace.name} ${arrivalTime.toString().slice(0, 5)}`;
	const fullAircraft = `${aircraft.model} ${aircraft.registration}`;
	const takeoffsLandingsDay = `${takeoffsDay ?? "-"} / ${landingsDay ?? "-"}`;
	const takeoffsLandingsNight = `${takeoffsNight ?? "-"} / ${landingsNight ?? "-"}`;

	return (
		<div className="flex flex-col gap-2">
			<Card>
				<CardBody className="grid grid-rows-7 sm:grid-rows-4 gap-x-8 gap-y-2 grid-flow-col">
					<DetailRow label="Date" value={date.toString()} />
					<DetailRow label="Departure" value={departure} />
					<DetailRow label="Arrival" value={arrival} />
					<DetailRow label="PIC" value={pilotInCommand.name} />
					<DetailRow label="Aircraft" value={fullAircraft} />
					<DetailRow
						label="Takeoffs / Landings Day"
						value={takeoffsLandingsDay}
					/>
					<DetailRow
						label="Takeoffs / Landings Night"
						value={takeoffsLandingsNight}
					/>
				</CardBody>
				<CardFooter className="flex flex-col items-start">
					<div className="text-default-500">Remarks</div>
					<div>{remarks ?? "-"}</div>
				</CardFooter>
			</Card>
			<TimeDetails title="This" times={singularTimes} />
			<TimeDetails title="Total" times={cumulatedTimes} />
		</div>
	);
};
