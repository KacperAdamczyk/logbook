import type { CreateAircraft } from "@/db/schema/aircraft";
import type { CreateLog } from "@/db/schema/logs";
import type { CreatePilot } from "@/db/schema/pilots";
import type { CreatePlace } from "@/db/schema/places";
import type { CreateTime } from "@/db/schema/times";
import type { User } from "next-auth";

export const user1 = {
	id: "0191670e-aabf-77b3-b5be-48dd4bad950a",
	name: "Test User1",
	email: "test-user",
	image: undefined,
} satisfies User;

export const place1 = {
	id: "0191a40d-7144-709e-b40f-035c4d49539f",
	name: "Place 1",
	userId: user1.id,
} satisfies CreatePlace;

export const place2 = {
	id: "0191a40d-ab9b-7495-8f8d-dad77253b5cf",
	name: "Place 2",
	userId: user1.id,
} satisfies CreatePlace;

export const aircraft1 = {
	id: "0191a40d-cde9-78bd-80c3-547df21f690e",
	userId: user1.id,
	model: "Aircraft 1",
	registration: "N12345",
} satisfies CreateAircraft;

export const pilot1 = {
	id: "0191a40e-010e-78fe-b0e8-99ac0d9d8232",
	userId: user1.id,
	name: "Pilot 1",
} satisfies CreatePilot;

export const singularTimes1 = {
	id: "0191a40e-478b-7077-adf0-d387b50f59d8",
	totalFlight: 1,
	singlePilotSingleEngine: 1,
	functionPilotInCommand: 1,
} satisfies CreateTime;

export const cumulatedTimes1 = {
	id: "0191a40e-6bb6-7f98-944e-9e65b8e8b88a",
	totalFlight: 1,
	singlePilotSingleEngine: 1,
	functionPilotInCommand: 1,
} satisfies CreateTime;

export const log1 = {
	id: "0191a40e-8589-76ce-a66a-2363fdac9e55",
	departureAt: new Date("2024-05-03T11:15:00Z"),
	arrivalAt: new Date("2024-05-03T12:15:00Z"),
	userId: user1.id,
	departurePlaceId: place1.id,
	arrivalPlaceId: place2.id,
	aircraftId: aircraft1.id,
	pilotInCommandId: pilot1.id,
	takeoffsDay: 1,
	landingsDay: 1,
	singularTimesId: singularTimes1.id,
	cumulatedTimesId: cumulatedTimes1.id,
} satisfies CreateLog;
