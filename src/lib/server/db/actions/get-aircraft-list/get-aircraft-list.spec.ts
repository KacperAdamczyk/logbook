import * as schema from "$lib/server/db/schema";
import type { DB } from "$lib/server/db";
import { getAircraftList } from "$lib/server/db/actions/get-aircraft-list/get-aircraft-list";
import { userTest } from "$test/fixtures";
import { Temporal } from "@js-temporal/polyfill";

const utcDate = (value: string): Date => new Date(Temporal.Instant.from(value).epochMilliseconds);

async function createFlightLogDeps(db: DB, userId: string, suffix: string) {
	const [pilot] = await db
		.insert(schema.pilot)
		.values({
			userId,
			name: `Pilot ${suffix}`,
		})
		.returning();
	const [place] = await db
		.insert(schema.place)
		.values({
			userId,
			name: `PLACE-${suffix}`,
		})
		.returning();

	return { pilot, place };
}

async function createFlightLogWithAircraft(
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
	"returns only user's aircraft with logs count including zero-log aircraft",
	async ({ db, testUser, expect }) => {
		const users = await db.query.user.findMany({ limit: 2 });
		if (users.length < 2) throw new Error("Need at least 2 test users");
		const otherUser = users.find((user) => user.id !== testUser.id)!;

		const [aircraftA] = await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N10001", model: "C172" })
			.returning();
		const [aircraftB] = await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N10002", model: "PA-28" })
			.returning();
		await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N10003", model: "DA42" })
			.returning();

		const [otherAircraft] = await db
			.insert(schema.aircraft)
			.values({ userId: otherUser.id, registration: "N20001", model: "SR22" })
			.returning();

		const ownDeps = await createFlightLogDeps(db, testUser.id, "90001");
		const otherDeps = await createFlightLogDeps(db, otherUser.id, "90002");

		await createFlightLogWithAircraft(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-01T09:00:00Z"),
			arrivalAt: utcDate("2024-01-01T10:00:00Z"),
			departurePlaceId: ownDeps.place.id,
			arrivalPlaceId: ownDeps.place.id,
			aircraftId: aircraftA.id,
			pilotInCommandId: ownDeps.pilot.id,
		});
		await createFlightLogWithAircraft(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-02T09:00:00Z"),
			arrivalAt: utcDate("2024-01-02T10:00:00Z"),
			departurePlaceId: ownDeps.place.id,
			arrivalPlaceId: ownDeps.place.id,
			aircraftId: aircraftA.id,
			pilotInCommandId: ownDeps.pilot.id,
		});
		await createFlightLogWithAircraft(db, {
			userId: testUser.id,
			departureAt: utcDate("2024-01-03T09:00:00Z"),
			arrivalAt: utcDate("2024-01-03T10:00:00Z"),
			departurePlaceId: ownDeps.place.id,
			arrivalPlaceId: ownDeps.place.id,
			aircraftId: aircraftB.id,
			pilotInCommandId: ownDeps.pilot.id,
		});

		await createFlightLogWithAircraft(db, {
			userId: otherUser.id,
			departureAt: utcDate("2024-01-04T09:00:00Z"),
			arrivalAt: utcDate("2024-01-04T10:00:00Z"),
			departurePlaceId: otherDeps.place.id,
			arrivalPlaceId: otherDeps.place.id,
			aircraftId: otherAircraft.id,
			pilotInCommandId: otherDeps.pilot.id,
		});

		const result = await getAircraftList(db, testUser.id, {
			page: 1,
			pageSize: 25,
		});

		expect(result.totalCount).toBe(3);
		expect(result.items.map((item) => item.registration)).toEqual(["N10001", "N10002", "N10003"]);
		expect(result.items).toEqual([
			expect.objectContaining({ registration: "N10001", model: "C172", logsCount: 2 }),
			expect.objectContaining({ registration: "N10002", model: "PA-28", logsCount: 1 }),
			expect.objectContaining({ registration: "N10003", model: "DA42", logsCount: 0 }),
		]);
	},
);

userTest(
	"applies case-insensitive search on registration/model and paginates filtered results",
	async ({ db, testUser, expect }) => {
		await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N123AA", model: "A320" })
			.returning();
		await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N124BB", model: "A321" })
			.returning();
		await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N999ZZ", model: "B737" })
			.returning();

		const pageOne = await getAircraftList(db, testUser.id, {
			page: 1,
			pageSize: 1,
			nameQuery: "  a32 ",
		});
		const pageTwo = await getAircraftList(db, testUser.id, {
			page: 2,
			pageSize: 1,
			nameQuery: "A32",
		});

		expect(pageOne.totalCount).toBe(2);
		expect(pageOne.items.map((item) => item.model)).toEqual(["A320"]);
		expect(pageTwo.totalCount).toBe(2);
		expect(pageTwo.items.map((item) => item.model)).toEqual(["A321"]);
	},
);
