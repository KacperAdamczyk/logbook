/**
 * Represents a time of day as [hours, minutes].
 * Hours should be 0-23, minutes should be 0-59.
 */
export type Time = readonly [hours: number, minutes: number];

/**
 * Represents a duration as [hours, minutes].
 * Hours can be any non-negative number, minutes should be 0-59.
 */
export type Duration = readonly [hours: number, minutes: number];

/**
 * Calculates the time difference between two times.
 * If the end time is earlier than the start time, it assumes the times cross midnight
 * and adds 24 hours to the calculation.
 *
 * @param start - The start time as [hours, minutes]
 * @param end - The end time as [hours, minutes]
 * @returns The duration between the two times as [hours, minutes]
 *
 * @example
 * // Same day: 10:30 to 14:45 = 4 hours 15 minutes
 * timeDifference([10, 30], [14, 45]) // Returns [4, 15]
 *
 * @example
 * // Crossing midnight: 22:00 to 02:30 = 4 hours 30 minutes
 * timeDifference([22, 0], [2, 30]) // Returns [4, 30]
 *
 * @example
 * // Same time returns zero duration
 * timeDifference([12, 0], [12, 0]) // Returns [0, 0]
 */
export function timeDifference(start: Time, end: Time): Duration {
	const [startHours, startMinutes] = start;
	const [endHours, endMinutes] = end;

	const startTotalMinutes = startHours * 60 + startMinutes;
	let endTotalMinutes = endHours * 60 + endMinutes;

	// If end is earlier than start, we crossed midnight
	if (endTotalMinutes < startTotalMinutes) {
		endTotalMinutes += 24 * 60; // Add 24 hours worth of minutes
	}

	const diffMinutes = endTotalMinutes - startTotalMinutes;

	const hours = Math.floor(diffMinutes / 60);
	const minutes = diffMinutes % 60;

	return [hours, minutes];
}
