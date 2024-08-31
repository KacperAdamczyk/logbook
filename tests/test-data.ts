import type { CreateAircraft } from "@/db/schema/aircraft";
import type { CreateLog } from "@/db/schema/logs";
import type { CreatePilot } from "@/db/schema/pilots";
import type { CreatePlace } from "@/db/schema/places";
import type { CreateTime } from "@/db/schema/times";
import type { User } from "next-auth";
import { v7 } from "uuid";

export const user1 = {
	id: v7(),
	name: "Test User1",
	email: "test-user",
	image: undefined,
} satisfies User;

export const place1 = {
	id: v7(),
	name: "Place 1",
	userId: user1.id,
} satisfies CreatePlace;

export const place2 = {
	id: v7(),
	name: "Place 2",
	userId: user1.id,
} satisfies CreatePlace;

export const aircraft1 = {
	id: v7(),
	userId: user1.id,
	model: "Aircraft 1",
	registration: "N12345",
} satisfies CreateAircraft;

export const pilot1 = {
	id: v7(),
	userId: user1.id,
	name: "Pilot 1",
} satisfies CreatePilot;

// Times
export const singularTimes1 = {
	id: v7(),
	totalFlight: 60,
	singlePilotSingleEngine: 60,
	functionPilotInCommand: 60,
} satisfies CreateTime;

export const cumulatedTimes1 = {
	id: v7(),
	totalFlight: 60,
	singlePilotSingleEngine: 60,
	functionPilotInCommand: 60,
} satisfies CreateTime;

export const singularTimes2 = {
	id: v7(),
	totalFlight: 60,
	singlePilotMultiEngine: 60,
	functionPilotInCommand: 60,
} satisfies CreateTime;

export const cumulatedTimes2 = {
	id: v7(),
	totalFlight: 120,
	singlePilotSingleEngine: 60,
	singlePilotMultiEngine: 60,
	functionPilotInCommand: 120,
} satisfies CreateTime;

export const singularTimes3 = {
	id: v7(),
	totalFlight: 90,
	multiPilot: 90,
	functionDual: 90,
	operationalConditionIfr: 90,
} satisfies CreateTime;

export const cumulatedTimes3 = {
	id: v7(),
	totalFlight: 210,
	multiPilot: 90,
	functionDual: 90,
	singlePilotSingleEngine: 60,
	singlePilotMultiEngine: 60,
	operationalConditionIfr: 90,
	functionPilotInCommand: 120,
} satisfies CreateTime;

export const singularTimes4 = {
	id: v7(),
	totalFlight: 120,
	singlePilotSingleEngine: 120,
	operationalConditionNight: 120,
	functionPilotInCommand: 120,
} satisfies CreateTime;

export const cumulatedTimes4 = {
	id: v7(),
	totalFlight: 330,
	singlePilotSingleEngine: 180,
	singlePilotMultiEngine: 60,
	operationalConditionNight: 120,
	functionDual: 90,
	operationalConditionIfr: 90,
	functionPilotInCommand: 240,
	multiPilot: 90,
} satisfies CreateTime;

export const singularTimes5 = {
	id: v7(),
	totalFlight: 72,
	multiPilot: 72,
	functionPilotInCommand: 72,
	operationalConditionIfr: 72,
} satisfies CreateTime;

export const cumulatedTimes5 = {
	id: v7(),
	totalFlight: 402,
	singlePilotSingleEngine: 180,
	singlePilotMultiEngine: 60,
	operationalConditionNight: 120,
	multiPilot: 162,
	functionDual: 90,
	operationalConditionIfr: 162,
	functionPilotInCommand: 312,
} satisfies CreateTime;

// Logs
export const log1 = {
	id: v7(),
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

export const log2 = {
	id: v7(),
	departureAt: new Date("2024-05-05T10:00:00Z"),
	arrivalAt: new Date("2024-05-05T11:00:00Z"),
	userId: user1.id,
	departurePlaceId: place1.id,
	arrivalPlaceId: place2.id,
	aircraftId: aircraft1.id,
	pilotInCommandId: pilot1.id,
	takeoffsDay: 1,
	landingsDay: 1,
	singularTimesId: singularTimes2.id,
	cumulatedTimesId: cumulatedTimes2.id,
} satisfies CreateLog;

export const log3 = {
	id: v7(),
	departureAt: new Date("2024-05-10T14:30:00Z"),
	arrivalAt: new Date("2024-05-10T16:00:00Z"),
	userId: user1.id,
	departurePlaceId: place2.id,
	arrivalPlaceId: place1.id,
	aircraftId: aircraft1.id,
	pilotInCommandId: pilot1.id,
	takeoffsDay: 1,
	landingsDay: 1,
	singularTimesId: singularTimes3.id,
	cumulatedTimesId: cumulatedTimes3.id,
} satisfies CreateLog;

export const log4 = {
	id: v7(),
	departureAt: new Date("2024-05-15T09:00:00Z"),
	arrivalAt: new Date("2024-05-15T11:00:00Z"),
	userId: user1.id,
	departurePlaceId: place1.id,
	arrivalPlaceId: place2.id,
	aircraftId: aircraft1.id,
	pilotInCommandId: pilot1.id,
	takeoffsDay: 2,
	landingsDay: 2,
	singularTimesId: singularTimes4.id,
	cumulatedTimesId: cumulatedTimes4.id,
} satisfies CreateLog;

export const log5 = {
	id: v7(),
	departureAt: new Date("2024-05-20T16:00:00Z"),
	arrivalAt: new Date("2024-05-20T17:12:00Z"),
	userId: user1.id,
	departurePlaceId: place2.id,
	arrivalPlaceId: place1.id,
	aircraftId: aircraft1.id,
	pilotInCommandId: pilot1.id,
	takeoffsDay: 1,
	landingsNight: 1,
	singularTimesId: singularTimes5.id,
	cumulatedTimesId: cumulatedTimes5.id,
} satisfies CreateLog;
