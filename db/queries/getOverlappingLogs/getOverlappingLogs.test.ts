import { db } from "@/db";
import { aircraft, log, pilot, place, time, user } from "@/db/schema";
import {
	aircraft1,
	cumulatedTimes1,
	log1,
	pilot1,
	place1,
	place2,
	singularTimes1,
	user1,
} from "@/tests/test-data";
import { beforeEach, describe, expect, test } from "vitest";
import { getOverlappingLogs } from "./getOverlappingLogs";

describe("getOverlappingLogs", () => {
	beforeEach(async () => {
		await db.batch([
			db.insert(user).values([user1]),
			db.insert(place).values([place1, place2]),
			db.insert(aircraft).values([aircraft1]),
			db.insert(pilot).values([pilot1]),
			db.insert(time).values([singularTimes1, cumulatedTimes1]),
			db.insert(log).values([log1]),
		]);
	});

	test.each([
		{
			name: "fully encompassing range",
			departure: new Date("2024-05-03T11:00:00Z"),
			arrival: new Date("2024-05-03T12:30:00Z"),
			overlaps: true,
		},
		{
			name: "exactly matching range",
			departure: new Date("2024-05-03T11:15:00Z"),
			arrival: new Date("2024-05-03T12:15:00Z"),
			overlaps: true,
		},
		{
			name: "range before log",
			departure: new Date("2024-05-03T10:00:00Z"),
			arrival: new Date("2024-05-03T11:00:00Z"),
			overlaps: false,
		},
		{
			name: "range after log",
			departure: new Date("2024-05-03T12:30:00Z"),
			arrival: new Date("2024-05-03T13:30:00Z"),
			overlaps: false,
		},
		{
			name: "partially overlapping range",
			departure: new Date("2024-05-03T11:45:00Z"),
			arrival: new Date("2024-05-03T12:45:00Z"),
			overlaps: true,
		},
		{
			name: "range barely not touching start of log",
			departure: new Date("2024-05-03T10:15:00Z"),
			arrival: new Date("2024-05-03T11:14:00Z"),
			overlaps: false,
		},
		{
			name: "range touching start of log",
			departure: new Date("2024-05-03T10:15:00Z"),
			arrival: new Date("2024-05-03T11:15:00Z"),
			overlaps: false,
		},
		{
			name: "range touching end of log",
			departure: new Date("2024-05-03T12:15:00Z"),
			arrival: new Date("2024-05-03T13:15:00Z"),
			overlaps: false,
		},
		{
			name: "range within log",
			departure: new Date("2024-05-03T11:30:00Z"),
			arrival: new Date("2024-05-03T12:00:00Z"),
			overlaps: true,
		},
		{
			name: "range with same start time as log",
			departure: new Date("2024-05-03T11:15:00Z"),
			arrival: new Date("2024-05-03T11:45:00Z"),
			overlaps: true,
		},
		{
			name: "range with same end time as log",
			departure: new Date("2024-05-03T11:45:00Z"),
			arrival: new Date("2024-05-03T12:15:00Z"),
			overlaps: true,
		},
		{
			name: "range spanning multiple days",
			departure: new Date("2024-05-02T12:00:00Z"),
			arrival: new Date("2024-05-04T12:00:00Z"),
			overlaps: true,
		},
	])("should handle $name", async ({ departure, arrival, overlaps }) => {
		const result = await getOverlappingLogs({
			userId: user1.id,
			departure,
			arrival,
		});

		expect(result).toHaveLength(+overlaps);
	});

	test("skips a log with logId", async () => {
		const result = await getOverlappingLogs({
			userId: user1.id,
			departure: new Date("2024-05-03T11:00:00Z"),
			arrival: new Date("2024-05-03T12:30:00Z"),
			logId: log1.id,
		});

		expect(result).toHaveLength(0);
	});
});
