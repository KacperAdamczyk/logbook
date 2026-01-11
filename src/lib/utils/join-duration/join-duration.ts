import { Temporal } from "@js-temporal/polyfill";

/**
 * Converts a Temporal.Duration to a 4-digit duration string (HHMM format).
 *
 * @param duration - A Temporal.Duration object
 * @returns A string in HHMM format (e.g., "1230" for 12 hours 30 minutes)
 *
 * @example
 * joinDuration(Temporal.Duration.from({ hours: 12, minutes: 30 })) // Returns "1230"
 * joinDuration(Temporal.Duration.from({ hours: 0, minutes: 0 })) // Returns "0000"
 */
export function joinDuration(duration: Temporal.Duration): string {
	const hh = duration.hours.toString().padStart(2, "0");
	const mm = duration.minutes.toString().padStart(2, "0");

	return `${hh}${mm}`;
}
