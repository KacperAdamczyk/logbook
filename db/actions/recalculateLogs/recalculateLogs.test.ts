import { db } from "@/db";
import { aircraft, logs, pilots, places, times, users } from "@/db/schema";
import {
	aircraft1,
	cumulatedTimes1,
	cumulatedTimes2,
	cumulatedTimes3,
	cumulatedTimes4,
	cumulatedTimes5,
	log1,
	log2,
	log3,
	log4,
	log5,
	pilot1,
	place1,
	place2,
	singularTimes1,
	singularTimes2,
	singularTimes3,
	singularTimes4,
	singularTimes5,
	user1,
} from "@/tests/test-data";
import { v7 } from "uuid";
import { beforeEach, describe, expect, test } from "vitest";
import { recalculateLogs } from "./recalculateLogs";

describe("recalculateLogs", () => {
	beforeEach(async () => {
		await db.batch([
			db.insert(users).values([user1]),
			db.insert(places).values([place1, place2]),
			db.insert(aircraft).values([aircraft1]),
			db.insert(pilots).values([pilot1]),
			db
				.insert(times)
				.values([
					singularTimes1,
					cumulatedTimes1,
					singularTimes2,
					cumulatedTimes2,
					singularTimes3,
					cumulatedTimes3,
					singularTimes4,
					cumulatedTimes4,
					singularTimes5,
					cumulatedTimes5,
				]),
			db.insert(logs).values([log1, log2, log3, log4, log5]),
		]);
	});

	test.each([
		{
			name: "all logs",
			since: new Date("2024-05-01T00:00:00Z"),
			expectedLength: 5,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "logs from specific date",
			since: new Date("2024-05-10T00:00:00Z"),
			expectedLength: 3,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "no logs after 'since' date",
			since: new Date("2024-06-01T00:00:00Z"),
			expectedLength: 0,
			expectedLastLog: null,
		},
		{
			name: "since date exactly matches first log",
			since: new Date("2024-05-03T11:15:00Z"),
			expectedLength: 5,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "since date is 1 second before first log",
			since: new Date("2024-05-03T11:14:59Z"),
			expectedLength: 5,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "since date is 1 second after first log",
			since: new Date("2024-05-03T12:15:01Z"),
			expectedLength: 4,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "since date is between logs",
			since: new Date("2024-05-04T00:00:00Z"),
			expectedLength: 4,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "since date is 1 second before last log",
			since: new Date("2024-05-20T15:59:59Z"),
			expectedLength: 1,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "since date exactly matches last log",
			since: new Date("2024-05-20T16:00:00Z"),
			expectedLength: 1,
			expectedLastLog: cumulatedTimes5,
		},
		{
			name: "since date is 1 second after last log",
			since: new Date("2024-05-20T16:00:01Z"),
			expectedLength: 0,
			expectedLastLog: null,
		},
	])(
		"should recalculate $name correctly",
		async ({ since, expectedLength, expectedLastLog }) => {
			const result = await recalculateLogs({ userId: user1.id, since });

			expect(result).toHaveLength(expectedLength);
			if (expectedLastLog) {
				expect(result.at(-1)).toEqual(expect.objectContaining(expectedLastLog));
			} else {
				expect(result).toHaveLength(0);
			}
			expect.assertions(2);
		},
	);

	test("should correctly evaluate a new log inserted between existing logs", async () => {
		const newSingularTimes = {
			id: v7(),
			totalFlight: 90,
			singlePilotSingleEngine: 90,
			functionPilotInCommand: 90,
			operationalConditionNight: 90,
		};

		const newCumulatedTimes = {
			id: v7(),
			totalFlight: 0,
			singlePilotSingleEngine: 0,
			singlePilotMultiEngine: 0,
			multiPilot: 0,
			operationalConditionNight: 0,
			operationalConditionIfr: 0,
			functionPilotInCommand: 0,
			functionCoPilot: 0,
			functionDual: 0,
			functionInstructor: 0,
		};

		const newLog = {
			id: v7(),
			departureAt: new Date("2024-05-07T22:00:00Z"),
			arrivalAt: new Date("2024-05-07T23:30:00Z"),
			userId: user1.id,
			departurePlaceId: place1.id,
			arrivalPlaceId: place2.id,
			aircraftId: aircraft1.id,
			pilotInCommandId: pilot1.id,
			takeoffsNight: 1,
			landingsNight: 1,
			singularTimesId: newSingularTimes.id,
			cumulatedTimesId: newCumulatedTimes.id,
		};

		await db.batch([
			db.insert(times).values([newSingularTimes, newCumulatedTimes]),
			db.insert(logs).values([newLog]),
		]);

		const result = await recalculateLogs({
			userId: user1.id,
			since: newLog.departureAt,
		});

		expect(result).toHaveLength(4);
		expect(result[0]).toEqual(
			expect.objectContaining({
				totalFlight: 210,
				singlePilotSingleEngine: 150,
				singlePilotMultiEngine: 60,
				functionPilotInCommand: 210,
				operationalConditionNight: 90,
			}),
		);
		expect(result[3]).toEqual(
			expect.objectContaining({
				totalFlight: 492,
				singlePilotSingleEngine: 270,
				singlePilotMultiEngine: 60,
				multiPilot: 162,
				operationalConditionNight: 210,
				operationalConditionIfr: 162,
				functionPilotInCommand: 402,
				functionDual: 90,
			}),
		);
	});

	test("should correctly evaluate a new log inserted before all existing logs", async () => {
		const newSingularTimes = {
			id: v7(),
			totalFlight: 45,
			singlePilotSingleEngine: 45,
			functionPilotInCommand: 45,
			operationalConditionNight: 45,
		};

		const newCumulatedTimes = {
			id: v7(),
			totalFlight: 0,
			singlePilotSingleEngine: 0,
			singlePilotMultiEngine: 0,
			multiPilot: 0,
			operationalConditionNight: 0,
			operationalConditionIfr: 0,
			functionPilotInCommand: 0,
			functionCoPilot: 0,
			functionDual: 0,
			functionInstructor: 0,
		};

		const newLog = {
			id: v7(),
			departureAt: new Date("2024-05-01T22:00:00Z"),
			arrivalAt: new Date("2024-05-01T22:45:00Z"),
			userId: user1.id,
			departurePlaceId: place1.id,
			arrivalPlaceId: place2.id,
			aircraftId: aircraft1.id,
			pilotInCommandId: pilot1.id,
			takeoffsNight: 1,
			landingsNight: 1,
			singularTimesId: newSingularTimes.id,
			cumulatedTimesId: newCumulatedTimes.id,
		};

		await db.batch([
			db.insert(times).values([newSingularTimes, newCumulatedTimes]),
			db.insert(logs).values([newLog]),
		]);

		const result = await recalculateLogs({
			userId: user1.id,
			since: new Date("2024-05-01T00:00:00Z"),
		});

		expect(result).toHaveLength(6);
		expect(result[0]).toEqual(
			expect.objectContaining({
				totalFlight: 45,
				singlePilotSingleEngine: 45,
				operationalConditionNight: 45,
				functionPilotInCommand: 45,
			}),
		);
		expect(result[1]).toEqual(
			expect.objectContaining({
				totalFlight: 105,
				singlePilotSingleEngine: 105,
				operationalConditionNight: 45,
				functionPilotInCommand: 105,
			}),
		);
		expect(result[5]).toEqual(
			expect.objectContaining({
				totalFlight: 447,
				singlePilotSingleEngine: 225,
				singlePilotMultiEngine: 60,
				multiPilot: 162,
				operationalConditionNight: 165,
				operationalConditionIfr: 162,
				functionPilotInCommand: 357,
				functionDual: 90,
			}),
		);
	});

	test("should handle user with no logs", async () => {
		const nonExistentUserId = "non-existent-user-id";
		const since = new Date("2024-05-01T00:00:00Z");
		const result = await recalculateLogs({ userId: nonExistentUserId, since });

		expect(result).toHaveLength(0);
	});
});
