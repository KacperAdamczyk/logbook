import { LogFormFieldValues } from "@/components/forms/LogForm";
import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";

export const useFlightDuration = (): number | null => {
	const [departureTime, arrivalTime] = useWatch<LogFormFieldValues>({
		name: ["departureTime", "arrivalTime"],
	});

	return useMemo(() => {
		if (!departureTime || !arrivalTime) {
			return null;
		}

		return calculateFlightTime(departureTime, arrivalTime);
	}, [departureTime, arrivalTime]);
};
