"use server";

import { actionClient } from "@/actions/safe-action";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { db } from "@/db";
import { getOrCreateAircraft } from "@/db/actions/getOrCreateAircraft";
import { getOrCreatePilot } from "@/db/actions/getOrCreatePilot";
import { getOrCreatePlace } from "@/db/actions/getOrCreatePlace";
import { recalculateLogs } from "@/db/actions/recalculateLogs";
import { getOverlappingLogs } from "@/db/queries/getOverlappingLogs";
import { log, time } from "@/db/schema";
import { getFlightDates } from "@/helpers/getFlightDates";
import { getParsedTimes } from "@/helpers/getParsedTimes";
import { returnValidationErrors } from "next-safe-action";
import { z } from "zod";

export const createLogAction = actionClient
	.schema(logFormSchema)
	.bindArgsSchemas([z.null()])
	.action(async ({ parsedInput, ctx: { userId } }) =>
		db.transaction(async (tx) => {
			const [departure, arrival] = getFlightDates(
				parsedInput.date,
				parsedInput.departureTime,
				parsedInput.arrivalTime,
			);

			const overlappingLogs = await getOverlappingLogs(
				{ userId, departure, arrival },
				tx,
			);

			if (overlappingLogs.length) {
				returnValidationErrors(logFormSchema, {
					_errors: ["This log overlaps with an existing log"],
				});
			}

			const arrivalPlace = await getOrCreatePlace(
				{
					userId,
					name: parsedInput.arrivalPlace,
				},
				tx,
			);
			const departurePlace = await getOrCreatePlace(
				{
					userId,
					name: parsedInput.departurePlace,
				},
				tx,
			);
			const aircraft = await getOrCreateAircraft(
				{
					userId,
					model: parsedInput.planeModel,
					registration: parsedInput.planeRegistration,
				},
				tx,
			);
			const pilot = await getOrCreatePilot(
				{ userId, name: parsedInput.pilotInCommand },
				tx,
			);

			const [singularTimes, cumulatedTimes] = await tx
				.insert(time)
				.values([getParsedTimes(parsedInput), {}])
				.returning();

			const {
				takeoffsDay,
				takeoffsNight,
				landingsDay,
				landingsNight,
				remarks,
			} = parsedInput;

			const [newLog] = await tx
				.insert(log)
				.values({
					userId,
					departureAt: departure,
					arrivalAt: arrival,
					departurePlaceId: departurePlace.id,
					arrivalPlaceId: arrivalPlace.id,
					aircraftId: aircraft.id,
					pilotInCommandId: pilot.id,
					takeoffsDay,
					takeoffsNight,
					landingsDay,
					landingsNight,
					remarks,
					singularTimesId: singularTimes.id,
					cumulatedTimesId: cumulatedTimes.id,
				})
				.returning();

			const recalculatedLogs = await recalculateLogs(
				{ userId, since: newLog.departureAt },
				tx,
			);

			return { log: newLog, recalculatedLogsCount: recalculatedLogs.length };
		}),
	);
