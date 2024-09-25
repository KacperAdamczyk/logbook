import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { describe, expect, test } from "vitest";

describe("calculateFlightTime", () => {
	test.each([
		[{ hour: 10, minute: 0 }, { hour: 11, minute: 0 }, 60],
		[{ hour: 10, minute: 0 }, { hour: 12, minute: 0 }, 120],
		[{ hour: 10, minute: 0 }, { hour: 10, minute: 30 }, 30],
		[{ hour: 6, minute: 0 }, { hour: 16, minute: 0 }, 600],
		[{ hour: 23, minute: 0 }, { hour: 1, minute: 0 }, 120],
		[{ hour: 23, minute: 59 }, { hour: 0, minute: 1 }, 2],
		[{ hour: 17, minute: 0 }, { hour: 3, minute: 0 }, 600],
	])(
		"should calculate flight time correctly from %s to %s as %i minutes",
		(departureTime, arrivalTime, expected) => {
			expect(calculateFlightTime(departureTime, arrivalTime)).toBe(expected);
		},
	);
});
