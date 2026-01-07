import { describe, it, expect } from "vitest";
import { timeDifference } from "./time-difference";

describe("timeDifference", () => {
	describe("same day (end time after start time)", () => {
		it.each([
			{
				start: [10, 30] as const,
				end: [14, 45] as const,
				expected: [4, 15],
				description: "typical daytime difference",
			},
			{
				start: [0, 0] as const,
				end: [23, 59] as const,
				expected: [23, 59],
				description: "nearly full day",
			},
			{
				start: [9, 0] as const,
				end: [9, 30] as const,
				expected: [0, 30],
				description: "30 minutes difference",
			},
			{
				start: [8, 45] as const,
				end: [10, 15] as const,
				expected: [1, 30],
				description: "1 hour 30 minutes",
			},
			{
				start: [12, 0] as const,
				end: [14, 0] as const,
				expected: [2, 0],
				description: "exact hours difference",
			},
		])("should calculate $description: $start -> $end = $expected", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});

	describe("crossing midnight (end time before start time)", () => {
		it.each([
			{
				start: [22, 0] as const,
				end: [2, 30] as const,
				expected: [4, 30],
				description: "evening to early morning",
			},
			{
				start: [23, 30] as const,
				end: [0, 30] as const,
				expected: [1, 0],
				description: "crossing midnight by 1 hour",
			},
			{
				start: [23, 59] as const,
				end: [0, 0] as const,
				expected: [0, 1],
				description: "1 minute past midnight",
			},
			{
				start: [20, 0] as const,
				end: [6, 0] as const,
				expected: [10, 0],
				description: "overnight flight",
			},
			{
				start: [18, 45] as const,
				end: [3, 15] as const,
				expected: [8, 30],
				description: "evening to early morning with minutes",
			},
		])("should calculate $description: $start -> $end = $expected", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});

	describe("edge cases", () => {
		it.each([
			{
				start: [12, 0] as const,
				end: [12, 0] as const,
				expected: [0, 0],
				description: "same time returns zero",
			},
			{
				start: [0, 0] as const,
				end: [0, 0] as const,
				expected: [0, 0],
				description: "midnight to midnight (same day)",
			},
			{
				start: [0, 0] as const,
				end: [0, 1] as const,
				expected: [0, 1],
				description: "1 minute after midnight",
			},
			{
				start: [23, 59] as const,
				end: [23, 59] as const,
				expected: [0, 0],
				description: "same time at end of day",
			},
		])("should handle $description", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});

	describe("boundary values", () => {
		it.each([
			{
				start: [0, 0] as const,
				end: [12, 0] as const,
				expected: [12, 0],
				description: "midnight to noon",
			},
			{
				start: [12, 0] as const,
				end: [0, 0] as const,
				expected: [12, 0],
				description: "noon to midnight (crossing midnight)",
			},
			{
				start: [6, 0] as const,
				end: [18, 0] as const,
				expected: [12, 0],
				description: "6am to 6pm",
			},
		])("should handle $description: $start -> $end = $expected", ({ start, end, expected }) => {
			expect(timeDifference(start, end)).toEqual(expected);
		});
	});
});
