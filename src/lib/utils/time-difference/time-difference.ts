import { Temporal } from "@js-temporal/polyfill";

/**
 * Calculates the time difference between two times.
 * If the end time is earlier than the start time, it assumes the times cross midnight
 * and adds 24 hours to the calculation.
 *
 * @param start - The start time as Temporal.PlainTime
 * @param end - The end time as Temporal.PlainTime
 * @returns The duration between the two times as Temporal.Duration
 *
 * @example
 * // Same day: 10:30 to 14:45 = 4 hours 15 minutes
 * timeDifference(
 *   Temporal.PlainTime.from({ hour: 10, minute: 30 }),
 *   Temporal.PlainTime.from({ hour: 14, minute: 45 })
 * ) // Returns Temporal.Duration of 4 hours 15 minutes
 *
 * @example
 * // Crossing midnight: 22:00 to 02:30 = 4 hours 30 minutes
 * timeDifference(
 *   Temporal.PlainTime.from({ hour: 22, minute: 0 }),
 *   Temporal.PlainTime.from({ hour: 2, minute: 30 })
 * ) // Returns Temporal.Duration of 4 hours 30 minutes
 *
 * @example
 * // Same time returns zero duration
 * timeDifference(
 *   Temporal.PlainTime.from({ hour: 12, minute: 0 }),
 *   Temporal.PlainTime.from({ hour: 12, minute: 0 })
 * ) // Returns Temporal.Duration of 0
 */
export function timeDifference(
	start: Temporal.PlainTime,
	end: Temporal.PlainTime,
): Temporal.Duration {
	const startTotalMinutes = start.hour * 60 + start.minute;
	let endTotalMinutes = end.hour * 60 + end.minute;

	// If end is earlier than start, we crossed midnight
	if (endTotalMinutes < startTotalMinutes) {
		endTotalMinutes += 24 * 60; // Add 24 hours worth of minutes
	}

	const diffMinutes = endTotalMinutes - startTotalMinutes;

	const hours = Math.floor(diffMinutes / 60);
	const minutes = diffMinutes % 60;

	return Temporal.Duration.from({ hours, minutes });
}
