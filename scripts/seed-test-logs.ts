import { createClient } from "@libsql/client";

const TOTAL_LOGS = 500;
const TARGET_FLIGHTS = 340;
const TARGET_SIMULATORS = TOTAL_LOGS - TARGET_FLIGHTS;
const MINUTE_MS = 60_000;

const airportNames = [
	"Warsaw Chopin",
	"Krakow",
	"Gdansk",
	"Poznan",
	"Wroclaw",
	"Katowice",
	"Prague",
	"Vienna",
	"Berlin",
	"Munich",
	"Copenhagen",
	"Zurich",
];

const pilotNames = [
	"Adam Nowak",
	"Ewa Kowalska",
	"Piotr Zielinski",
	"Marek Wisniewski",
	"Agnieszka Lewandowska",
	"Tomasz Krawczyk",
	"Marta Mazur",
	"Jan Dabrowski",
];

const aircraftFleet = [
	{ model: "Cessna 172", registration: "SP-KAC" },
	{ model: "Piper PA-28", registration: "SP-LOG" },
	{ model: "Diamond DA40", registration: "SP-DBA" },
	{ model: "Beechcraft Baron 58", registration: "SP-MEP" },
	{ model: "Cessna 152", registration: "SP-TRN" },
	{ model: "Diamond DA42", registration: "SP-IFR" },
];

const simulatorTypes = ["FNPT II", "FFS", "FTD"];
const flightRemarks = [
	"Routine regional sector.",
	"Local training sortie with navigation exercise.",
	"Cross-country under stable weather.",
	"Short repositioning leg.",
	"Operational proficiency flight.",
];
const simRemarks = [
	"Instrument procedures and holds.",
	"Abnormal and emergency checklist drills.",
	"Approach and missed-approach repetition.",
	"Crew coordination and CRM session.",
];

class Prng {
	private state: number;

	constructor(seed: number) {
		this.state = seed >>> 0;
	}

	next(): number {
		this.state = (1664525 * this.state + 1013904223) >>> 0;
		return this.state / 2 ** 32;
	}

	int(min: number, max: number): number {
		return Math.floor(this.next() * (max - min + 1)) + min;
	}

	pick<T>(arr: T[]): T {
		return arr[Math.floor(this.next() * arr.length)]!;
	}
}

function id(prefix: string): string {
	return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
}

function pickDistinct<T>(arr: T[], rng: Prng): [T, T] {
	const a = rng.pick(arr);
	let b = rng.pick(arr);
	while (b === a) b = rng.pick(arr);
	return [a, b];
}

async function main() {
	const client = createClient({
		url: process.env.DATABASE_URL ?? "file:local.db",
		authToken: process.env.DATABASE_AUTH_TOKEN,
	});

	const users = await client.execute({
		sql: "select id from user order by created_at asc limit 1",
	});
	const userId = (users.rows[0]?.id as string | undefined) ?? process.env.USER_ID;
	if (!userId) throw new Error("No user found. Create an account first or pass USER_ID.");

	const now = Date.now();
	const rng = new Prng(20260220);

	await client.execute("BEGIN");
	try {
		for (const name of airportNames) {
			await client.execute({
				sql: `
					insert or ignore into place (id, createdAt, updatedAt, userId, name)
					values (?, ?, ?, ?, ?)
				`,
				args: [id("place"), now, now, userId, name],
			});
		}

		for (const name of pilotNames) {
			await client.execute({
				sql: `
					insert or ignore into pilot (id, createdAt, updatedAt, userId, name)
					values (?, ?, ?, ?, ?)
				`,
				args: [id("pilot"), now, now, userId, name],
			});
		}

		for (const aircraft of aircraftFleet) {
			await client.execute({
				sql: `
					insert or ignore into aircraft (id, createdAt, updatedAt, userId, model, registration)
					values (?, ?, ?, ?, ?, ?)
				`,
				args: [id("aircraft"), now, now, userId, aircraft.model, aircraft.registration],
			});
		}

		const places = await client.execute({
			sql: "select id from place where userId = ? order by name asc",
			args: [userId],
		});
		const pilots = await client.execute({
			sql: "select id from pilot where userId = ? order by name asc",
			args: [userId],
		});
		const aircraft = await client.execute({
			sql: "select id, model from aircraft where userId = ? order by model asc, registration asc",
			args: [userId],
		});

		const placeIds = places.rows.map((row) => row.id as string);
		const pilotIds = pilots.rows.map((row) => row.id as string);
		const aircraftRows = aircraft.rows.map((row) => ({
			id: row.id as string,
			model: row.model as string,
		}));

		if (placeIds.length < 2 || pilotIds.length < 1 || aircraftRows.length < 1) {
			throw new Error("Missing reference rows for places/pilots/aircraft.");
		}

		const maxDate = await client.execute({
			sql: `
				select max(ts) as ts
				from (
					select max(arrivalAt) as ts from flight_log where userId = ?
					union all
					select max(date) as ts from simulator_log where userId = ?
				)
			`,
			args: [userId, userId],
		});

		let cursor = Number(maxDate.rows[0]?.ts ?? 0);
		if (!Number.isFinite(cursor) || cursor <= 0) {
			cursor = Date.UTC(2024, 0, 1, 6, 0, 0, 0);
		}
		cursor += 90 * MINUTE_MS;

		let flightsRemaining = TARGET_FLIGHTS;
		let simsRemaining = TARGET_SIMULATORS;

		for (let i = 0; i < TOTAL_LOGS; i += 1) {
			const slotsRemaining = TOTAL_LOGS - i;
			const mustFlight = flightsRemaining === slotsRemaining;
			const mustSim = simsRemaining === slotsRemaining;
			const ratio = flightsRemaining / slotsRemaining;
			const isFlight = mustFlight || (!mustSim && rng.next() < ratio);

			const gapMinutes = rng.int(20, 95);
			const start = cursor + gapMinutes * MINUTE_MS;

			if (isFlight) {
				const duration = rng.int(45, 195);
				const end = start + duration * MINUTE_MS;
				const [departurePlaceId, arrivalPlaceId] = pickDistinct(placeIds, rng);
				const pilotInCommandId = rng.pick(pilotIds);
				const aircraftRow = rng.pick(aircraftRows);

				const multiPilotTime = rng.next() < 0.23 ? Math.min(duration - 5, rng.int(15, 90)) : 0;
				const singleTime = duration - multiPilotTime;
				const singlePilotMultiEngineTime =
					/(Baron|DA42)/.test(aircraftRow.model) && singleTime > 0
						? rng.int(0, singleTime)
						: 0;
				const singlePilotSingleEngineTime = singleTime - singlePilotMultiEngineTime;

				const functionCoPilotTime =
					multiPilotTime > 0 && rng.next() < 0.45 ? rng.int(10, multiPilotTime) : 0;
				const functionPilotInCommandTime = duration - functionCoPilotTime;
				const functionDualTime = rng.next() < 0.12 ? rng.int(0, Math.min(25, duration)) : 0;
				const functionInstructorTime =
					functionDualTime > 0 && rng.next() < 0.3 ? rng.int(0, functionDualTime) : 0;
				const operationalConditionNightTime =
					rng.next() < 0.28 ? rng.int(0, Math.min(90, duration)) : 0;
				const operationalConditionIfrTime =
					rng.next() < 0.4 ? rng.int(0, Math.min(120, duration)) : 0;
				const takeoffsNight = operationalConditionNightTime > 20 && rng.next() < 0.5 ? 1 : 0;
				const takeoffsDay = 1 - takeoffsNight;
				const landingsNight = takeoffsNight;
				const landingsDay = takeoffsDay;

				await client.execute({
					sql: `
						insert into flight_log (
							id, createdAt, updatedAt, userId, departureAt, arrivalAt, departurePlaceId,
							arrivalPlaceId, aircraftId, pilotInCommandId, totalFlightTime,
							singlePilotSingleEngineTime, singlePilotMultiEngineTime, multiPilotTime,
							operationalConditionNightTime, operationalConditionIfrTime,
							functionPilotInCommandTime, functionCoPilotTime, functionDualTime,
							functionInstructorTime, takeoffsDay, takeoffsNight, landingsDay,
							landingsNight, remarks
						) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
					`,
					args: [
						id("seedfl"),
						now,
						now,
						userId,
						start,
						end,
						departurePlaceId,
						arrivalPlaceId,
						aircraftRow.id,
						pilotInCommandId,
						duration,
						singlePilotSingleEngineTime,
						singlePilotMultiEngineTime,
						multiPilotTime,
						operationalConditionNightTime,
						operationalConditionIfrTime,
						functionPilotInCommandTime,
						functionCoPilotTime,
						functionDualTime,
						functionInstructorTime,
						takeoffsDay,
						takeoffsNight,
						landingsDay,
						landingsNight,
						rng.pick(flightRemarks),
					],
				});

				cursor = end;
				flightsRemaining -= 1;
			} else {
				const duration = rng.int(30, 180);
				const end = start + duration * MINUTE_MS;

				await client.execute({
					sql: `
						insert into simulator_log (id, createdAt, updatedAt, userId, date, type, totalTime, remarks)
						values (?, ?, ?, ?, ?, ?, ?, ?)
					`,
					args: [
						id("seedsim"),
						now,
						now,
						userId,
						start,
						rng.pick(simulatorTypes),
						duration,
						rng.pick(simRemarks),
					],
				});

				cursor = end;
				simsRemaining -= 1;
			}
		}

		await client.execute("COMMIT");
	} catch (error) {
		await client.execute("ROLLBACK");
		throw error;
	}

	const inserted = await client.execute({
		sql: `
			select
				(select count(*) from flight_log where userId = ? and id like 'seedfl_%') as flightCount,
				(select count(*) from simulator_log where userId = ? and id like 'seedsim_%') as simCount
		`,
		args: [userId, userId],
	});

	const overlaps = await client.execute({
		sql: `
			select count(*) as overlapCount
			from flight_log a
			join flight_log b
				on a.userId = b.userId
				and a.id < b.id
				and a.departureAt < b.arrivalAt
				and a.arrivalAt > b.departureAt
			where a.userId = ?
				and a.id like 'seedfl_%'
				and b.id like 'seedfl_%'
		`,
		args: [userId],
	});

	console.log(
		JSON.stringify(
			{
				userId,
				seededFlights: Number(inserted.rows[0]?.flightCount ?? 0),
				seededSimulators: Number(inserted.rows[0]?.simCount ?? 0),
				seededTotal:
					Number(inserted.rows[0]?.flightCount ?? 0) + Number(inserted.rows[0]?.simCount ?? 0),
				flightOverlapsInSeed: Number(overlaps.rows[0]?.overlapCount ?? 0),
			},
			null,
			2,
		),
	);
}

await main();
