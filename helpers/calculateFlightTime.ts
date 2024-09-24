import type { TimeValue } from "@/types/TimeValue";
import { Time } from "@internationalized/date";

const MS_TO_MIN = 60_000;

export const calculateFlightTime = (
	departureTime: TimeValue,
	arrivalTime: TimeValue,
): number => {
	try {
		const duration = new Time(arrivalTime.hour, arrivalTime.minute).compare(
			new Time(departureTime.hour, departureTime.minute),
		);

		if (duration < 0) {
			return 24 * 60 + duration / MS_TO_MIN;
		}

		return duration / MS_TO_MIN;
	} catch {
		return 0;
	}
};
