import { describe, it, expect } from "vitest";
import { splitDuration } from "./split-duration";

describe("splitDuration", () => {
	describe("valid inputs", () => {
		it.each([
			{ input: "1230", expected: [12, 30], description: "typical duration" },
			{ input: "0000", expected: [0, 0], description: "all zeros" },
			{ input: "2359", expected: [23, 59], description: "maximum valid time" },
			{ input: "0100", expected: [1, 0], description: "leading zeros in hours" },
			{ input: "0001", expected: [0, 1], description: "leading zeros in minutes" },
			{ input: "9999", expected: [99, 99], description: "all nines" },
		])("should handle $description: $input -> $expected", ({ input, expected }) => {
			expect(splitDuration(input)).toEqual(expected);
		});
	});

	describe("invalid format - wrong length", () => {
		it.each([
			{ input: "123", length: 3, description: "3-digit string" },
			{ input: "12345", length: 5, description: "5-digit string" },
			{ input: "", length: 0, description: "empty string" },
		])("should throw error for $description", ({ input, length }) => {
			expect(() => splitDuration(input)).toThrow(
				`Duration must be exactly 4 digits, received: "${input}" (length: ${length})`,
			);
		});
	});

	describe("invalid format - non-numeric", () => {
		it.each([
			{
				input: "12ab",
				error: 'Duration must contain only digits, received: "12ab"',
				description: "letters at end",
			},
			{
				input: "ab12",
				error: 'Duration must contain only digits, received: "ab12"',
				description: "letters at start",
			},
			{
				input: "12:30",
				error: 'Duration must be exactly 4 digits, received: "12:30" (length: 5)',
				description: "colon separator",
			},
			{
				input: "12 30",
				error: 'Duration must be exactly 4 digits, received: "12 30" (length: 5)',
				description: "spaces",
			},
		])("should throw error for string with $description", ({ input, error }) => {
			expect(() => splitDuration(input)).toThrow(error);
		});
	});
});
