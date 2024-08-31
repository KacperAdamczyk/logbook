import { db } from "@/db";
import { aircraft, logs, pilots, places, times, users } from "@/db/schema";
import {
    user1, place1, place2, aircraft1, pilot1,
    singularTimes1, cumulatedTimes1, log1,
    singularTimes2, cumulatedTimes2, log2,
    singularTimes3, cumulatedTimes3, log3,
    singularTimes4, cumulatedTimes4, log4,
    singularTimes5, cumulatedTimes5, log5
} from "@/tests/test-data";
import { beforeEach, describe, expect, test } from "vitest";
import { recalculateLogs } from "./recalculateLogs";

describe("recalculateLogs", () => {
    beforeEach(async () => {
        await db.batch([
            db.insert(users).values([user1]),
            db.insert(places).values([place1, place2]),
            db.insert(aircraft).values([aircraft1]),
            db.insert(pilots).values([pilot1]),
            db.insert(times).values([
                singularTimes1, cumulatedTimes1,
                singularTimes2, cumulatedTimes2,
                singularTimes3, cumulatedTimes3,
                singularTimes4, cumulatedTimes4,
                singularTimes5, cumulatedTimes5
            ]),
            db.insert(logs).values([log1, log2, log3, log4, log5]),
        ]);
    });

    test.each([
        {
            name: "all logs",
            since: new Date("2024-05-01T00:00:00Z"),
            expectedLength: 5,
            expectedLastLog: {
                totalFlight: 402,
                singlePilotSingleEngine: 180,
                singlePilotMultiEngine: 60,
                multiPilot: 162,
                operationalConditionNight: 120,
                operationalConditionIfr: 162,
                functionPilotInCommand: 312,
                functionDual: 90,
            }
        },
        {
            name: "logs from specific date",
            since: new Date("2024-05-10T00:00:00Z"),
            expectedLength: 3,
            expectedLastLog: {
                totalFlight: 282,
                singlePilotSingleEngine: 120,
                multiPilot: 162,
                operationalConditionNight: 120,
                operationalConditionIfr: 162,
                functionPilotInCommand: 192,
                functionDual: 90,
            }
        },
        {
            name: "no logs after 'since' date",
            since: new Date("2024-06-01T00:00:00Z"),
            expectedLength: 0,
            expectedLastLog: null
        }
    ])("should recalculate $name correctly", async ({ since, expectedLength, expectedLastLog }) => {
        const result = await recalculateLogs({ userId: user1.id, since });

        expect(result).toHaveLength(expectedLength);
        if (expectedLastLog) {
            expect(result[result.length - 1]).toEqual(expect.objectContaining(expectedLastLog));
        }
    });

    test("should handle user with no logs", async () => {
        const nonExistentUserId = "non-existent-user-id";
        const since = new Date("2024-05-01T00:00:00Z");
        const result = await recalculateLogs({ userId: nonExistentUserId, since });

        expect(result).toHaveLength(0);
    });
});
