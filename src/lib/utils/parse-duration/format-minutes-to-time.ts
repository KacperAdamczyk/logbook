import { Temporal } from "@js-temporal/polyfill";

/**
 * Formats minutes as a duration string in hh:mm format using Temporal.Duration.
 *
 * @param minutes - Total number of minutes (fractional values are floored)
 * @returns A string in hh:mm format (e.g., "12:30", "00:45", "100:15")
 *
 * @example
 * formatMinutesToTime(90) // Returns "01:30"
 * formatMinutesToTime(750) // Returns "12:30"
 * formatMinutesToTime(45) // Returns "00:45"
 * formatMinutesToTime(6015) // Returns "100:15"
 */
export function formatMinutesToTime(minutes: number): string {
	const wholeMinutes = Math.floor(minutes);
	const duration = Temporal.Duration.from({ minutes: wholeMinutes });
	const hours = Math.floor(duration.total("hours"));
	const remainingMinutes = Math.floor(duration.total("minutes") % 60);

	return `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}`;
}
