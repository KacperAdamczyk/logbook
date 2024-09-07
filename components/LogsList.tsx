import { LogListTable } from "@/components/LogListTable";
import { formatMinutes } from "@/helpers/formatMinutes";
import { getUserId } from "@/helpers/getUserId";
import { getUserLogs } from "@/queries/getUserLogs";
import { fromDate, toCalendarDate, toTime } from "@internationalized/date";

export const LogsList = async () => {
	const userId = await getUserId();
	const logs = await getUserLogs(userId);

	const tableData = logs.map(
		({
			id,
			departureAt,
			arrivalAt,
			singularTimes,
			pilotInCommand,
			aircraft,
		}) => {
			const departureDate = fromDate(departureAt, "utc");
			const arrivalDate = fromDate(arrivalAt, "utc");
			const date = toCalendarDate(departureDate);
			const departureTime = toTime(departureDate);
			const arrivalTime = toTime(arrivalDate);

			return {
				id,
				date: date.toString(),
				departure: departureTime.toString().slice(0, 5),
				arrival: arrivalTime.toString().slice(0, 5),
				totalTime: formatMinutes(singularTimes.totalFlight),
				pic: pilotInCommand.name,
				aircraft: aircraft.model,
			};
		},
	);

	return <LogListTable logs={tableData} />;
};
