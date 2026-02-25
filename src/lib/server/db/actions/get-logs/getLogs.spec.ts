import { getLogs } from "$lib/server/db/actions/get-logs/get-logs";
import type { DB } from "$lib/server/db";
import { userTest, createTestFlightLog } from "$test/fixtures";
import * as schema from "$lib/server/db/schema";
import { Temporal } from "@js-temporal/polyfill";

const utcDate = (value: string): Date =>
	new Date(Temporal.Instant.from(value).epochMilliseconds);

async function createFlightLogWithRoute(
	db: DB,
	userId: string,
	params: {
		departureAt: Date;
		arrivalAt: Date;
		departurePlaceId: string;
		arrivalPlaceId: string;
		aircraftId: string;
		pilotInCommandId: string;
		remarks?: string;
	},
) {
	const [flightLog] = await db
		.insert(schema.flightLog)
		.values({
			userId,
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
			remarks: params.remarks ?? "",
		})
		.returning();

	return flightLog;
}

async function createTestSimulatorLog(
	db: DB,
	userId: string,
	date: Date,
	type = "FNPT II",
) {
	const [simLog] = await db
		.insert(schema.simulatorLog)
		.values({
			userId,
			date,
			type,
			totalTime: 90,
			remarks: "",
		})
		.returning();

	return simLog;
}

userTest("returns logs for the specified user", async ({ db, testUser, expect }) => {
	// Get another user
	const users = await db.query.user.findMany({ limit: 2 });
	if (users.length < 2) throw new Error("Need at least 2 test users");
	const otherUser = users.find((u) => u.id !== testUser.id)!;

	// Create deps for both users
	const [ownAircraft] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N11111", model: "Cessna 172" })
		.returning();
	const [ownPilot] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "Own Pilot" })
		.returning();
	const [ownPlace] = await db
		.insert(schema.place)
		.values({ userId: testUser.id, name: "KJFK" })
		.returning();

	const [otherAircraft] = await db
		.insert(schema.aircraft)
		.values({ userId: otherUser.id, registration: "N22222", model: "Piper PA-28" })
		.returning();
	const [otherPilot] = await db
		.insert(schema.pilot)
		.values({ userId: otherUser.id, name: "Other Pilot" })
		.returning();
	const [otherPlace] = await db
		.insert(schema.place)
		.values({ userId: otherUser.id, name: "KLAX" })
		.returning();

	// Create own flight log
	await createTestFlightLog(
		db,
		testUser.id,
		new Date("2024-01-01T10:00:00Z"),
		new Date("2024-01-01T11:00:00Z"),
		{
			aircraftId: ownAircraft.id,
			pilotId: ownPilot.id,
			placeId: ownPlace.id,
		},
	);

	// Create other user's flight log
	await createTestFlightLog(
		db,
		otherUser.id,
		new Date("2024-01-01T12:00:00Z"),
		new Date("2024-01-01T13:00:00Z"),
		{
			aircraftId: otherAircraft.id,
			pilotId: otherPilot.id,
			placeId: otherPlace.id,
		},
	);

	// getLogs returns logs for the specified user only
	const result = await getLogs(db, testUser.id, { page: 1, pageSize: 50 });
	const logs = result.items;

	// Should contain only testUser's logs
	const ownLogs = logs.filter((log) => log.userId === testUser.id);
	expect(ownLogs.length).toBeGreaterThanOrEqual(1);

	// Should not contain other user's logs
	const otherUserLogs = logs.filter((log) => log.userId === otherUser.id);
	expect(otherUserLogs).toHaveLength(0);
	expect(result.totalCount).toBe(ownLogs.length);
});

userTest(
	"applies page and pageSize while returning totalCount",
	async ({ db, testUser, expect }) => {
		const [aircraft] = await db
			.insert(schema.aircraft)
			.values({ userId: testUser.id, registration: "N33333", model: "Cessna 172" })
			.returning();
		const [pilot] = await db
			.insert(schema.pilot)
			.values({ userId: testUser.id, name: "Pagination Pilot" })
			.returning();
		const [place] = await db
			.insert(schema.place)
			.values({ userId: testUser.id, name: "KSEA" })
			.returning();

		for (let day = 1; day <= 3; day++) {
			await createTestFlightLog(
				db,
				testUser.id,
				new Date(`2024-01-0${day}T10:00:00Z`),
				new Date(`2024-01-0${day}T11:00:00Z`),
				{
					aircraftId: aircraft.id,
					pilotId: pilot.id,
					placeId: place.id,
				},
			);
		}

		const pageOne = await getLogs(db, testUser.id, { page: 1, pageSize: 2 });
		const pageTwo = await getLogs(db, testUser.id, { page: 2, pageSize: 2 });

		expect(pageOne.items).toHaveLength(2);
		expect(pageTwo.totalCount).toBe(pageOne.totalCount);
		expect(pageOne.totalCount).toBe(3);
		expect(pageOne.items[0]?.date.getTime()).toBeGreaterThan(pageOne.items[1]?.date.getTime() ?? 0);
		expect(pageTwo.items).toHaveLength(1);
		expect(pageOne.items.map((log) => log.id)).not.toContain(pageTwo.items[0]?.id);
		expect(pageOne.items[1]?.date.getTime()).toBeGreaterThan(pageTwo.items[0]?.date.getTime() ?? 0);
	},
);

userTest("applies inclusive UTC date range filters", async ({ db, testUser, expect }) => {
	const [aircraft] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N40001", model: "C172" })
		.returning();
	const [pilot] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "Date Filter Pilot" })
		.returning();
	const [place] = await db
		.insert(schema.place)
		.values({ userId: testUser.id, name: "EDDF" })
		.returning();

	const before = await createTestFlightLog(
		db,
		testUser.id,
		utcDate("2024-02-28T23:00:00Z"),
		utcDate("2024-02-28T23:50:00Z"),
		{ aircraftId: aircraft.id, pilotId: pilot.id, placeId: place.id },
	);
	const fromBoundary = await createTestFlightLog(
		db,
		testUser.id,
		utcDate("2024-03-01T00:00:00Z"),
		utcDate("2024-03-01T01:00:00Z"),
		{ aircraftId: aircraft.id, pilotId: pilot.id, placeId: place.id },
	);
	const toBoundary = await createTestFlightLog(
		db,
		testUser.id,
		utcDate("2024-03-03T23:59:59.000Z"),
		utcDate("2024-03-04T00:59:59.000Z"),
		{ aircraftId: aircraft.id, pilotId: pilot.id, placeId: place.id },
	);
	const after = await createTestFlightLog(
		db,
		testUser.id,
		utcDate("2024-03-04T00:00:00Z"),
		utcDate("2024-03-04T01:00:00Z"),
		{ aircraftId: aircraft.id, pilotId: pilot.id, placeId: place.id },
	);

	const result = await getLogs(db, testUser.id, {
		page: 1,
		pageSize: 50,
		filters: { dateFrom: "2024-03-01", dateTo: "2024-03-03" },
	});

	expect(result.items.map((log) => log.id)).toEqual([toBoundary.id, fromBoundary.id]);
	expect(result.items.map((log) => log.id)).not.toContain(before.id);
	expect(result.items.map((log) => log.id)).not.toContain(after.id);
	expect(result.totalCount).toBe(2);
});

userTest("filters by departure and arrival place independently", async ({ db, testUser, expect }) => {
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
	const [aircraft] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N40002", model: "PA-28" })
		.returning();
	const [pilot] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "Route Pilot" })
		.returning();

	const routeAB = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-04-01T09:00:00Z"),
		arrivalAt: utcDate("2024-04-01T10:00:00Z"),
		departurePlaceId: placeA.id,
		arrivalPlaceId: placeB.id,
		aircraftId: aircraft.id,
		pilotInCommandId: pilot.id,
	});
	const routeCB = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-04-02T09:00:00Z"),
		arrivalAt: utcDate("2024-04-02T10:00:00Z"),
		departurePlaceId: placeC.id,
		arrivalPlaceId: placeB.id,
		aircraftId: aircraft.id,
		pilotInCommandId: pilot.id,
	});
	const routeAC = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-04-03T09:00:00Z"),
		arrivalAt: utcDate("2024-04-03T10:00:00Z"),
		departurePlaceId: placeA.id,
		arrivalPlaceId: placeC.id,
		aircraftId: aircraft.id,
		pilotInCommandId: pilot.id,
	});

	const departureFiltered = await getLogs(db, testUser.id, {
		page: 1,
		pageSize: 50,
		filters: { departurePlaceId: placeA.id },
	});
	expect(departureFiltered.items.map((log) => log.id)).toEqual([routeAC.id, routeAB.id]);
	expect(departureFiltered.totalCount).toBe(2);

	const arrivalFiltered = await getLogs(db, testUser.id, {
		page: 1,
		pageSize: 50,
		filters: { arrivalPlaceId: placeB.id },
	});
	expect(arrivalFiltered.items.map((log) => log.id)).toEqual([routeCB.id, routeAB.id]);
	expect(arrivalFiltered.totalCount).toBe(2);
});

userTest("filters by pilot in command and aircraft", async ({ db, testUser, expect }) => {
	const [place] = await db
		.insert(schema.place)
		.values({ userId: testUser.id, name: "LOWW" })
		.returning();
	const [aircraftA] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N40003", model: "C172" })
		.returning();
	const [aircraftB] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N40004", model: "PA34" })
		.returning();
	const [pilotA] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "PIC A" })
		.returning();
	const [pilotB] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "PIC B" })
		.returning();

	const matchPilot = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-05-01T08:00:00Z"),
		arrivalAt: utcDate("2024-05-01T09:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftA.id,
		pilotInCommandId: pilotA.id,
	});
	const matchAircraft = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-05-02T08:00:00Z"),
		arrivalAt: utcDate("2024-05-02T09:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftB.id,
		pilotInCommandId: pilotB.id,
	});
	await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-05-03T08:00:00Z"),
		arrivalAt: utcDate("2024-05-03T09:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftA.id,
		pilotInCommandId: pilotB.id,
	});

	const pilotFiltered = await getLogs(db, testUser.id, {
		page: 1,
		pageSize: 50,
		filters: { pilotInCommandId: pilotA.id },
	});
	expect(pilotFiltered.items.map((log) => log.id)).toEqual([matchPilot.id]);
	expect(pilotFiltered.totalCount).toBe(1);

	const aircraftFiltered = await getLogs(db, testUser.id, {
		page: 1,
		pageSize: 50,
		filters: { aircraftId: aircraftB.id },
	});
	expect(aircraftFiltered.items.map((log) => log.id)).toEqual([matchAircraft.id]);
	expect(aircraftFiltered.totalCount).toBe(1);
});

userTest("applies combined filters with AND semantics and paginates filtered results", async ({
	db,
	testUser,
	expect,
}) => {
	const [place] = await db
		.insert(schema.place)
		.values({ userId: testUser.id, name: "LIRF" })
		.returning();
	const [aircraftMatch] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N40005", model: "DA42" })
		.returning();
	const [aircraftOther] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N40006", model: "C152" })
		.returning();
	const [pilotMatch] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "Combined Pilot" })
		.returning();
	const [pilotOther] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "Other Combined Pilot" })
		.returning();

	// Three matching rows to verify filtered pagination.
	const match1 = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-06-01T08:00:00Z"),
		arrivalAt: utcDate("2024-06-01T09:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftMatch.id,
		pilotInCommandId: pilotMatch.id,
	});
	const match2 = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-06-02T08:00:00Z"),
		arrivalAt: utcDate("2024-06-02T09:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftMatch.id,
		pilotInCommandId: pilotMatch.id,
	});
	const match3 = await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-06-03T08:00:00Z"),
		arrivalAt: utcDate("2024-06-03T09:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftMatch.id,
		pilotInCommandId: pilotMatch.id,
	});

	// Non-matching rows.
	await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-06-02T10:00:00Z"),
		arrivalAt: utcDate("2024-06-02T11:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftOther.id,
		pilotInCommandId: pilotMatch.id,
	});
	await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-06-02T12:00:00Z"),
		arrivalAt: utcDate("2024-06-02T13:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftMatch.id,
		pilotInCommandId: pilotOther.id,
	});
	await createFlightLogWithRoute(db, testUser.id, {
		departureAt: utcDate("2024-05-31T08:00:00Z"),
		arrivalAt: utcDate("2024-05-31T09:00:00Z"),
		departurePlaceId: place.id,
		arrivalPlaceId: place.id,
		aircraftId: aircraftMatch.id,
		pilotInCommandId: pilotMatch.id,
	});

	const filters = {
		dateFrom: "2024-06-01",
		dateTo: "2024-06-03",
		aircraftId: aircraftMatch.id,
		pilotInCommandId: pilotMatch.id,
	};
	const pageOne = await getLogs(db, testUser.id, { page: 1, pageSize: 2, filters });
	const pageTwo = await getLogs(db, testUser.id, { page: 2, pageSize: 2, filters });

	expect(pageOne.totalCount).toBe(3);
	expect(pageTwo.totalCount).toBe(3);
	expect(pageOne.items.map((log) => log.id)).toEqual([match3.id, match2.id]);
	expect(pageTwo.items.map((log) => log.id)).toEqual([match1.id]);
});

userTest("date-only filters include simulator logs, flight-specific filters exclude them", async ({
	db,
	testUser,
	expect,
}) => {
	const [aircraft] = await db
		.insert(schema.aircraft)
		.values({ userId: testUser.id, registration: "N40007", model: "SR22" })
		.returning();
	const [pilot] = await db
		.insert(schema.pilot)
		.values({ userId: testUser.id, name: "Simulator Mix Pilot" })
		.returning();
	const [place] = await db
		.insert(schema.place)
		.values({ userId: testUser.id, name: "ESSA" })
		.returning();

	const flight = await createTestFlightLog(
		db,
		testUser.id,
		utcDate("2024-07-10T10:00:00Z"),
		utcDate("2024-07-10T11:00:00Z"),
		{ aircraftId: aircraft.id, pilotId: pilot.id, placeId: place.id },
	);
	const simulator = await createTestSimulatorLog(db, testUser.id, utcDate("2024-07-11T00:00:00Z"));

	const dateOnly = await getLogs(db, testUser.id, {
		page: 1,
		pageSize: 50,
		filters: { dateFrom: "2024-07-10", dateTo: "2024-07-11" },
	});
	expect(dateOnly.items.map((log) => log.id)).toEqual([simulator.id, flight.id]);
	expect(dateOnly.items.map((log) => log.type)).toEqual(["simulator", "flight"]);

	const flightSpecific = await getLogs(db, testUser.id, {
		page: 1,
		pageSize: 50,
		filters: { dateFrom: "2024-07-10", dateTo: "2024-07-11", aircraftId: aircraft.id },
	});
	expect(flightSpecific.items.map((log) => log.id)).toEqual([flight.id]);
	expect(flightSpecific.totalCount).toBe(1);
});
