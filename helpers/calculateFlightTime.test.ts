import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { describe, expect, test } from "vitest";

describe("calculateFlightTime", () => {
	test.each([
		["10:00", "11:00", 60],
		["10:00", "12:00", 120],
		["10:00", "10:30", 30],
		["06:00", "16:00", 600],
		["23:00", "01:00", 120],
		["23:59", "00:01", 2],
		["17:00", "03:00", 600],
	])(
		"should calculate flight time correctly from %s to %s as %i minutes",
		(departureTime, arrivalTime, expected) => {
			expect(calculateFlightTime(departureTime, arrivalTime)).toBe(expected);
		},
	);
});
