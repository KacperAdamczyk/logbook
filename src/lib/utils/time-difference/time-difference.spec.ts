import { describe, it, expect } from "vitest";
import { timeDifference } from "./time-difference";
import { Temporal } from "@js-temporal/polyfill";

const time = (hour: number, minute: number) => Temporal.PlainTime.from({ hour, minute });
const duration = (hours: number, minutes: number) => Temporal.Duration.from({ hours, minutes });

describe("timeDifference", () => {
	describe("same day (end time after start time)", () => {
		it.each([
			{
				start: time(10, 30),
				end: time(14, 45),
				expected: duration(4, 15),
				description: "typical daytime difference",
			},
			{
				start: time(0, 0),
				end: time(23, 59),
				expected: duration(23, 59),
				description: "nearly full day",
			},
			{
				start: time(9, 0),
				end: time(9, 30),
				expected: duration(0, 30),
				description: "30 minutes difference",
			},
			{
				start: time(8, 45),
				end: time(10, 15),
				expected: duration(1, 30),
				description: "1 hour 30 minutes",
			},
			{
				start: time(12, 0),
				end: time(14, 0),
				expected: duration(2, 0),
				description: "exact hours difference",
			},
		])("should calculate $description", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});

	describe("crossing midnight (end time before start time)", () => {
		it.each([
			{
				start: time(22, 0),
				end: time(2, 30),
				expected: duration(4, 30),
				description: "evening to early morning",
			},
			{
				start: time(23, 30),
				end: time(0, 30),
				expected: duration(1, 0),
				description: "crossing midnight by 1 hour",
			},
			{
				start: time(23, 59),
				end: time(0, 0),
				expected: duration(0, 1),
				description: "1 minute past midnight",
			},
			{
				start: time(20, 0),
				end: time(6, 0),
				expected: duration(10, 0),
				description: "overnight flight",
			},
			{
				start: time(18, 45),
				end: time(3, 15),
				expected: duration(8, 30),
				description: "evening to early morning with minutes",
			},
		])("should calculate $description", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});

	describe("edge cases", () => {
		it.each([
			{
				start: time(12, 0),
				end: time(12, 0),
				expected: duration(0, 0),
				description: "same time returns zero",
			},
			{
				start: time(0, 0),
				end: time(0, 0),
				expected: duration(0, 0),
				description: "midnight to midnight (same day)",
			},
			{
				start: time(0, 0),
				end: time(0, 1),
				expected: duration(0, 1),
				description: "1 minute after midnight",
			},
			{
				start: time(23, 59),
				end: time(23, 59),
				expected: duration(0, 0),
				description: "same time at end of day",
			},
		])("should handle $description", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});

	describe("boundary values", () => {
		it.each([
			{
				start: time(0, 0),
				end: time(12, 0),
				expected: duration(12, 0),
				description: "midnight to noon",
			},
			{
				start: time(12, 0),
				end: time(0, 0),
				expected: duration(12, 0),
				description: "noon to midnight (crossing midnight)",
			},
			{
				start: time(6, 0),
				end: time(18, 0),
				expected: duration(12, 0),
				description: "6am to 6pm",
			},
		])("should handle $description", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});
});
