import * as schema from "$lib/server/db/schema";
import type { DB } from "$lib/server/db";
import { getPilotsList } from "$lib/server/db/actions/get-pilots-list/get-pilots-list";
import { userTest } from "$test/fixtures";
import { Temporal } from "@js-temporal/polyfill";

const utcDate = (value: string): Date => new Date(Temporal.Instant.from(value).epochMilliseconds);

async function createFlightLogDeps(db: DB, userId: string, suffix: string) {
	const [aircraft] = await db
		.insert(schema.aircraft)
		.values({
			userId,
			registration: `N${suffix}`,
			model: "C172",
		})
		.returning();
	const [place] = await db
		.insert(schema.place)
		.values({
			userId,
			name: `PLACE-${suffix}`,
		})
		.returning();

	return { aircraft, place };
}

async function createFlightLogWithPilot(
	db: DB,
	params: {
		userId: string;
		departureAt: Date;
		arrivalAt: Date;
		departurePlaceId: string;
		arrivalPlaceId: string;
		aircraftId: string;
		pilotInCommandId: string;
	},
) {
	await db.insert(schema.flightLog).values({
		userId: params.userId,
		departureAt: params.departureAt,
		arrivalAt: params.arrivalAt,
		departurePlaceId: params.departurePlaceId,
		arrivalPlaceId: params.arrivalPlaceId,
		aircraftId: params.aircraftId,
		pilotInCommandId: params.pilotInCommandId,
		totalFlightTime: 60,
		singlePilotSingleEngineTime: 60,
		singlePilotMultiEngineTime: 0,
		multiPilotTime: 0,
		operationalConditionNightTime: 0,
		operationalConditionIfrTime: 0,
		functionPilotInCommandTime: 60,
		functionCoPilotTime: 0,
		functionDualTime: 0,
		functionInstructorTime: 0,
		takeoffsDay: 1,
		takeoffsNight: 0,
		landingsDay: 1,
		landingsNight: 0,
		remarks: "",
	});
}

userTest(
	"returns only user's pilots with logs count including zero-log pilots",
	async ({ db, testUser, expect }) => {
		const users = await db.query.user.findMany({ limit: 2 });
		if (users.length < 2) throw new Error("Need at least 2 test users");
		const otherUser = users.find((user) => user.id !== testUser.id)!;

		const [pilotA] = await db
			.insert(schema.pilot)
			.values({ userId: testUser.id, name: "ALPHA PILOT" })
			.returning();
		const [pilotB] = await db
			.insert(schema.pilot)
			.values({ userId: testUser.id, name: "BRAVO PILOT" })
			.returning();
		await db
			.insert(schema.pilot)
			.values({ userId: testUser.id, name: "CHARLIE PILOT" })
			.returning();

		const [otherPilot] = await db
			.insert(schema.pilot)
			.values({ userId: otherUser.id, name: "DELTA PILOT" })
			.returning();

		const ownDeps = await createFlightLogDeps(db, testUser.id, "70001");
		const otherDeps = await createFlightLogDeps(db, otherUser.id, "80001");

		await createFlightLogWithPilot(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-01T09:00:00Z"),
			arrivalAt: utcDate("2024-01-01T10:00:00Z"),
			departurePlaceId: ownDeps.place.id,
			arrivalPlaceId: ownDeps.place.id,
			aircraftId: ownDeps.aircraft.id,
			pilotInCommandId: pilotA.id,
		});
		await createFlightLogWithPilot(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-02T09:00:00Z"),
			arrivalAt: utcDate("2024-01-02T10:00:00Z"),
			departurePlaceId: ownDeps.place.id,
			arrivalPlaceId: ownDeps.place.id,
			aircraftId: ownDeps.aircraft.id,
			pilotInCommandId: pilotA.id,
		});
		await createFlightLogWithPilot(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-03T09:00:00Z"),
			arrivalAt: utcDate("2024-01-03T10:00:00Z"),
			departurePlaceId: ownDeps.place.id,
			arrivalPlaceId: ownDeps.place.id,
			aircraftId: ownDeps.aircraft.id,
			pilotInCommandId: pilotB.id,
		});

		await createFlightLogWithPilot(db, {
			userId: otherUser.id,
			departureAt: utcDate("2024-01-04T09:00:00Z"),
			arrivalAt: utcDate("2024-01-04T10:00:00Z"),
			departurePlaceId: otherDeps.place.id,
			arrivalPlaceId: otherDeps.place.id,
			aircraftId: otherDeps.aircraft.id,
			pilotInCommandId: otherPilot.id,
		});

		const result = await getPilotsList(db, testUser.id, {
			page: 1,
			pageSize: 25,
		});

		expect(result.totalCount).toBe(3);
		expect(result.items.map((item) => item.name)).toEqual([
			"ALPHA PILOT",
			"BRAVO PILOT",
			"CHARLIE PILOT",
		]);
		expect(result.items).toEqual([
			expect.objectContaining({ name: "ALPHA PILOT", logsCount: 2 }),
			expect.objectContaining({ name: "BRAVO PILOT", logsCount: 1 }),
			expect.objectContaining({ name: "CHARLIE PILOT", logsCount: 0 }),
		]);
	},
);

userTest(
	"applies case-insensitive name search and paginates filtered results",
	async ({ db, testUser, expect }) => {
		await db.insert(schema.pilot).values({ userId: testUser.id, name: "Anna" }).returning();
		await db.insert(schema.pilot).values({ userId: testUser.id, name: "Annie" }).returning();
		await db.insert(schema.pilot).values({ userId: testUser.id, name: "Bob" }).returning();

		const pageOne = await getPilotsList(db, testUser.id, {
			page: 1,
			pageSize: 1,
			nameQuery: "  AN ",
		});
		const pageTwo = await getPilotsList(db, testUser.id, {
			page: 2,
			pageSize: 1,
			nameQuery: "an",
		});

		expect(pageOne.totalCount).toBe(2);
		expect(pageOne.items.map((item) => item.name)).toEqual(["Anna"]);
		expect(pageTwo.totalCount).toBe(2);
		expect(pageTwo.items.map((item) => item.name)).toEqual(["Annie"]);
	},
);
