import type { TimeValue } from "@/types/TimeValue";

export const timeToMinutes = ({ hour, minute }: TimeValue): number => {
	return hour * 60 + minute;
};
