import type { TimeValue } from "@/types/TimeValue";
import { CalendarDateTime, Time } from "@internationalized/date";

export const getFlightDates = (
	date: Date,
	departureTime: TimeValue,
	arrivalTime: TimeValue,
) => {
	const departure = new Time(departureTime.hour, departureTime.minute);
	const arrival = new Time(arrivalTime.hour, arrivalTime.minute);

	const departureDate = new CalendarDateTime(
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate(),
		departureTime.hour,
		departureTime.minute,
	);
	const arrivalDate = new CalendarDateTime(
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate(),
		arrivalTime.hour,
		arrivalTime.minute,
	).add({ days: departure.compare(arrival) > 0 ? 1 : 0 });

	return [departureDate.toDate("utc"), arrivalDate.toDate("utc")];
};
