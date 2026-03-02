import * as schema from "$lib/server/db/schema";
import type { DB } from "$lib/server/db";
import { getPlacesList } from "$lib/server/db/actions/get-places-list/get-places-list";
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
	const [pilot] = await db
		.insert(schema.pilot)
		.values({
			userId,
			name: `Pilot ${suffix}`,
		})
		.returning();

	return { aircraft, pilot };
}

async function createFlightLogWithRoute(
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
	"returns only user's places with arrivals/departures/total counts including zero-count places",
	async ({ db, testUser, expect }) => {
		const users = await db.query.user.findMany({ limit: 2 });
		if (users.length < 2) throw new Error("Need at least 2 test users");
		const otherUser = users.find((user) => user.id !== testUser.id)!;

		const [placeA] = await db
			.insert(schema.place)
			.values({ userId: testUser.id, name: "EPWA" })
			.returning();
		const [placeB] = await db
			.insert(schema.place)
			.values({ userId: testUser.id, name: "EGLL" })
			.returning();
		const [placeC] = await db
			.insert(schema.place)
			.values({ userId: testUser.id, name: "EDDM" })
			.returning();
		await db.insert(schema.place).values({ userId: testUser.id, name: "LFPG" }).returning();

		const [otherPlace] = await db
			.insert(schema.place)
			.values({ userId: otherUser.id, name: "KJFK" })
			.returning();

		const ownDeps = await createFlightLogDeps(db, testUser.id, "50001");
		const otherDeps = await createFlightLogDeps(db, otherUser.id, "60001");

		await createFlightLogWithRoute(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-01T09:00:00Z"),
			arrivalAt: utcDate("2024-01-01T10:00:00Z"),
			departurePlaceId: placeA.id,
			arrivalPlaceId: placeB.id,
			aircraftId: ownDeps.aircraft.id,
			pilotInCommandId: ownDeps.pilot.id,
		});
		await createFlightLogWithRoute(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-02T09:00:00Z"),
			arrivalAt: utcDate("2024-01-02T10:00:00Z"),
			departurePlaceId: placeA.id,
			arrivalPlaceId: placeC.id,
			aircraftId: ownDeps.aircraft.id,
			pilotInCommandId: ownDeps.pilot.id,
		});
		await createFlightLogWithRoute(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-03T09:00:00Z"),
			arrivalAt: utcDate("2024-01-03T10:00:00Z"),
			departurePlaceId: placeC.id,
			arrivalPlaceId: placeA.id,
			aircraftId: ownDeps.aircraft.id,
			pilotInCommandId: ownDeps.pilot.id,
		});

		await createFlightLogWithRoute(db, {
			userId: otherUser.id,
			departureAt: utcDate("2024-01-04T09:00:00Z"),
			arrivalAt: utcDate("2024-01-04T10:00:00Z"),
			departurePlaceId: otherPlace.id,
			arrivalPlaceId: otherPlace.id,
			aircraftId: otherDeps.aircraft.id,
			pilotInCommandId: otherDeps.pilot.id,
		});

		const result = await getPlacesList(db, testUser.id, {
			page: 1,
			pageSize: 25,
		});

		expect(result.totalCount).toBe(4);
		expect(result.items.map((item) => item.name)).toEqual(["EDDM", "EGLL", "EPWA", "LFPG"]);

		const eham = result.items.find((item) => item.name === "EPWA");
		const egll = result.items.find((item) => item.name === "EGLL");
		const eddm = result.items.find((item) => item.name === "EDDM");
		const lfpg = result.items.find((item) => item.name === "LFPG");

		expect(eham).toMatchObject({
			arrivalsCount: 1,
			departuresCount: 2,
			totalCount: 3,
		});
		expect(egll).toMatchObject({
			arrivalsCount: 1,
			departuresCount: 0,
			totalCount: 1,
		});
		expect(eddm).toMatchObject({
			arrivalsCount: 1,
			departuresCount: 1,
			totalCount: 2,
		});
		expect(lfpg).toMatchObject({
			arrivalsCount: 0,
			departuresCount: 0,
			totalCount: 0,
		});
	},
);

userTest(
	"applies case-insensitive name search and paginates filtered results",
	async ({ db, testUser, expect }) => {
		await db.insert(schema.place).values({ userId: testUser.id, name: "Alpha" }).returning();
		await db.insert(schema.place).values({ userId: testUser.id, name: "Alpine" }).returning();
		await db.insert(schema.place).values({ userId: testUser.id, name: "Bravo" }).returning();

		const pageOne = await getPlacesList(db, testUser.id, {
			page: 1,
			pageSize: 1,
			nameQuery: "  ALP ",
		});
		const pageTwo = await getPlacesList(db, testUser.id, {
			page: 2,
			pageSize: 1,
			nameQuery: "alp",
		});

		expect(pageOne.totalCount).toBe(2);
		expect(pageOne.items.map((item) => item.name)).toEqual(["Alpha"]);
		expect(pageTwo.totalCount).toBe(2);
		expect(pageTwo.items.map((item) => item.name)).toEqual(["Alpine"]);
	},
);
