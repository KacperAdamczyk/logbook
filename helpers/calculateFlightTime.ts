import { parseTime } from "@internationalized/date";

const MS_TO_MIN = 60_000;

export const calculateFlightTime = (
	departureTime: string,
	arrivalTime: string,
): number => {
	const duration = parseTime(arrivalTime).compare(parseTime(departureTime));

	if (duration < 0) {
		return 24 * 60 + duration / MS_TO_MIN;
	}

	return duration / MS_TO_MIN;
};
