/**
 * Splits a 4-digit duration string (HHMM format) into hours and minutes.
 *
 * @param duration - A 4-digit string representing duration in HHMM format (e.g., "1230" for 12 hours 30 minutes)
 * @returns A tuple containing [hours, minutes] as numbers
 * @throws {Error} If the duration is not exactly 4 characters or contains non-numeric characters
 *
 * @example
 * splitDuration("1230") // Returns [12, 30]
 * splitDuration("0000") // Returns [0, 0]
 * splitDuration("2359") // Returns [23, 59]
 */
export function splitDuration(duration: string): [number, number] {
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

	return [hours, minutes];
}
