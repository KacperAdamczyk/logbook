import { db } from "@/db";
import { getOverlappingLogs } from "./getOverlappingLogs";
import { user1, log1, pilot1, place1, aircraft1, place2, singularTimes1, cumulatedTimes1 } from "@/tests/test-data";
import { beforeEach, describe, expect, test } from "vitest";
import { users, places, aircraft, pilots, times, logs } from "@/db/schema";

describe("getOverlappingLogs", () => {
    beforeEach(async () => {
        await db.batch([
            db.insert(users).values([user1]),
            db.insert(places).values([place1, place2]),
            db.insert(aircraft).values([aircraft1]),
            db.insert(pilots).values([pilot1]),
            db.insert(times).values([singularTimes1, cumulatedTimes1]),
            db.insert(logs).values([log1]),
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
        },{
            name: "range touching start of log",
            departure: new Date("2024-05-03T10:15:00Z"),
            arrival: new Date("2024-05-03T11:15:00Z"),
            overlaps: true,
        },
        {
            name: "range touching end of log",
            departure: new Date("2024-05-03T12:15:00Z"),
            arrival: new Date("2024-05-03T13:15:00Z"),
            overlaps: true,
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
        const result = await getOverlappingLogs({ departure, arrival });

        expect(result).toHaveLength(+overlaps);
    });
});
