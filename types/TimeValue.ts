export interface TimeValue {
	hour: number;
	minute: number;
}

export const isTimeValue = (value: unknown): value is TimeValue =>
	typeof value === "object" &&
	value !== null &&
	"hour" in value &&
	"minute" in value &&
	typeof value.hour === "number" &&
	typeof value.minute === "number";
