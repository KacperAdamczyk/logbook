import { describe, it, expect } from "vitest";
import { formatMinutesToTime } from "./format-minutes-to-time";

describe("formatMinutesToTime", () => {
	describe("valid inputs", () => {
		it.each([
			{ input: 90, expected: "01:30", description: "90 minutes = 1 hour 30 minutes" },
			{ input: 750, expected: "12:30", description: "750 minutes = 12 hours 30 minutes" },
			{ input: 45, expected: "00:45", description: "45 minutes" },
			{ input: 0, expected: "00:00", description: "zero minutes" },
			{ input: 60, expected: "01:00", description: "exactly 1 hour" },
			{ input: 1440, expected: "24:00", description: "24 hours" },
			{ input: 6015, expected: "100:15", description: "over 100 hours" },
			{ input: 1, expected: "00:01", description: "1 minute" },
			{ input: 59, expected: "00:59", description: "59 minutes" },
			{ input: 61, expected: "01:01", description: "1 hour 1 minute" },
			{ input: 1439, expected: "23:59", description: "23 hours 59 minutes" },
		])("should format $description: $input -> $expected", ({ input, expected }) => {
			expect(formatMinutesToTime(input)).toBe(expected);
		});
	});

	describe("edge cases", () => {
		it("should handle fractional minutes by flooring", () => {
			expect(formatMinutesToTime(90.7)).toBe("01:30");
		});

		it("should handle large hour values", () => {
			expect(formatMinutesToTime(9999)).toBe("166:39");
		});
	});
});
