import { describe, expect, test } from "vitest";
import { getFlightDates } from "./getFlightDates";

describe("getFlightDates", () => {
	test.each([
		[
			"2023-05-01",
			"09:00:00",
			"14:30:00",
			["2023-05-01T09:00:00.000Z", "2023-05-01T14:30:00.000Z"],
		],
		[
			"2023-05-01",
			"22:00",
			"05:30",
			["2023-05-01T22:00:00.000Z", "2023-05-02T05:30:00.000Z"],
		],
		[
			"2023-05-01",
			"00:00:00",
			"06:00:00",
			["2023-05-01T00:00:00.000Z", "2023-05-01T06:00:00.000Z"],
		],
		[
			"2023-05-01",
			"18:00",
			"00:00",
			["2023-05-01T18:00:00.000Z", "2023-05-02T00:00:00.000Z"],
		],
		[
			"2023-12-31",
			"23:00",
			"01:00",
			["2023-12-31T23:00:00.000Z", "2024-01-01T01:00:00.000Z"],
		],
	])(
		"should calculate flight dates correctly for date %s, departure %s, arrival %s",
		(
			date,
			departureTime,
			arrivalTime,
			[expectedDeparture, expectedArrival],
		) => {
			const [departure, arrival] = getFlightDates(
				date,
				departureTime,
				arrivalTime,
			);
			expect(departure.toISOString()).toEqual(expectedDeparture);
			expect(arrival.toISOString()).toEqual(expectedArrival);
		},
	);
});
