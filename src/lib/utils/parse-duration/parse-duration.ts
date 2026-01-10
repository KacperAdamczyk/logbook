import { Temporal } from "@js-temporal/polyfill";

/**
 * Parses a 4-digit duration string (HHMM format) into a Temporal.Duration.
 *
 * @param duration - A 4-digit string representing duration in HHMM format (e.g., "1230" for 12 hours 30 minutes)
 * @returns A Temporal.Duration representing the duration
 * @throws {Error} If the duration is not exactly 4 characters or contains non-numeric characters
 *
 * @example
 * parseDuration("1230") // Returns Temporal.Duration of 12 hours 30 minutes
 * parseDuration("0000") // Returns Temporal.Duration of 0
 * parseDuration("9959") // Returns Temporal.Duration of 99 hours 59 minutes
 */
export function parseDuration(duration: string): Temporal.Duration {
	if (duration.length !== 4) {
		throw new Error(
			`Duration must be exactly 4 digits, received: "${duration}" (length: ${duration.length})`,
		);
	}

	if (!/^\d{4}$/.test(duration)) {
		throw new Error(`Duration must contain only digits, received: "${duration}"`);
	}

	const hours = Number.parseInt(duration.slice(0, 2), 10);
	const minutes = Number.parseInt(duration.slice(2, 4), 10);

	return Temporal.Duration.from({ hours, minutes });
}
