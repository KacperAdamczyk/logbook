import type { TimeValue } from "@/types/TimeValue";

export const minutesToTime = (minutes: number): TimeValue => {
	const hour = Math.floor(minutes / 60);
	const minute = minutes % 60;

	return { hour, minute };
};
