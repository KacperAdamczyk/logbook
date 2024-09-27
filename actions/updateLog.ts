"use server";

import { actionClient } from "@/actions/safe-action";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { db } from "@/db";
import { getOrCreateAircraft } from "@/db/actions/getOrCreateAircraft";
import { getOrCreatePilot } from "@/db/actions/getOrCreatePilot";
import { getOrCreatePlace } from "@/db/actions/getOrCreatePlace";
import { recalculateLogs } from "@/db/actions/recalculateLogs";
import { getOverlappingLogs } from "@/db/queries/getOverlappingLogs";
import { logs, times } from "@/db/schema";
import { getFlightDates } from "@/helpers/getFlightDates";
import { getParsedTimes } from "@/helpers/getParsedTimes";
import { eq } from "drizzle-orm";
import { returnValidationErrors } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updateLogAction = actionClient
	.schema(logFormSchema)
	.bindArgsSchemas([z.string().uuid()])
	.action(
		async ({ parsedInput, bindArgsParsedInputs: [logId], ctx: { userId } }) =>
			db.transaction(async (tx) => {
				const log = await tx.query.logs.findFirst({
					where: (logs, { and, eq }) =>
						and(eq(logs.userId, userId), eq(logs.id, logId)),
				});

				if (!log) {
					returnValidationErrors(logFormSchema, {
						_errors: ["Log not found"],
					});
				}

				const [departure, arrival] = getFlightDates(
					parsedInput.date,
					parsedInput.departureTime,
					parsedInput.arrivalTime,
				);

				const overlappingLogs = await getOverlappingLogs(
					{ userId, logId, departure, arrival },
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

				await tx
					.update(times)
					.set(getParsedTimes(parsedInput))
					.where(eq(times.id, log.singularTimesId));

				const {
					takeoffsDay,
					takeoffsNight,
					landingsDay,
					landingsNight,
					remarks,
				} = parsedInput;

				const [updatedLog] = await tx
					.update(logs)
					.set({
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
					})
					.where(eq(logs.id, logId))
					.returning();

				const recalculatedLogs = await recalculateLogs(
					{ userId, since: updatedLog.departureAt },
					tx,
				);

				revalidatePath("/");

				return { log, recalculatedLogsCount: recalculatedLogs.length };
			}),
	);
