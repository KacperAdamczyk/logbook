import { Temporal } from "@js-temporal/polyfill";

/**
 * Parses a 4-digit time string (HHMM format) into a Temporal.PlainTime.
 *
 * @param time - A 4-digit string representing time in HHMM format (e.g., "1430" for 14:30)
 * @returns A Temporal.PlainTime representing the time of day
 * @throws {Error} If the time is not exactly 4 characters or contains non-numeric characters
 * @throws {RangeError} If hours are not 0-23 or minutes are not 0-59
 *
 * @example
 * parseTime("1430") // Returns Temporal.PlainTime for 14:30
 * parseTime("0000") // Returns Temporal.PlainTime for 00:00
 * parseTime("2359") // Returns Temporal.PlainTime for 23:59
 */
export function parseTime(time: string): Temporal.PlainTime {
	if (time.length !== 4) {
		throw new Error(
			`Time must be exactly 4 digits, received: "${time}" (length: ${time.length})`,
		);
	}

	if (!/^\d{4}$/.test(time)) {
		throw new Error(`Time must contain only digits, received: "${time}"`);
	}

	const hour = Number.parseInt(time.slice(0, 2), 10);
	const minute = Number.parseInt(time.slice(2, 4), 10);

	return Temporal.PlainTime.from({ hour, minute });
}
