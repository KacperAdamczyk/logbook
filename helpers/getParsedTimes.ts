import type { LogFormValues } from "@/actions/validation/logFormSchema";
import { formatToMinutes } from "@/helpers/formatToMinutes";

type GetParsedTimesArgs = Pick<
	LogFormValues,
	| "totalFlightTime"
	| "singlePilotTimeSingleEngine"
	| "singlePilotTimeMultiEngine"
	| "multiPilotTime"
	| "operationalConditionTimeNight"
	| "operationalConditionTimeIfr"
	| "functionTimePilotInCommand"
	| "functionTimeCoPilot"
	| "functionTimeInstructor"
	| "functionTimeDual"
>;

export const getParsedTimes = ({
	totalFlightTime,
	singlePilotTimeSingleEngine,
	singlePilotTimeMultiEngine,
	multiPilotTime,
	operationalConditionTimeNight,
	operationalConditionTimeIfr,
	functionTimePilotInCommand,
	functionTimeCoPilot,
	functionTimeInstructor,
	functionTimeDual,
}: GetParsedTimesArgs) => ({
	totalFlight: formatToMinutes(totalFlightTime),
	singlePilotSingleEngine: singlePilotTimeSingleEngine
		? formatToMinutes(singlePilotTimeSingleEngine)
		: undefined,
	singlePilotMultiEngine: singlePilotTimeMultiEngine
		? formatToMinutes(singlePilotTimeMultiEngine)
		: undefined,
	multiPilot: multiPilotTime ? formatToMinutes(multiPilotTime) : undefined,
	operationalConditionNight: operationalConditionTimeNight
		? formatToMinutes(operationalConditionTimeNight)
		: undefined,
	operationalConditionIfr: operationalConditionTimeIfr
		? formatToMinutes(operationalConditionTimeIfr)
		: undefined,
	functionPilotInCommand: functionTimePilotInCommand
		? formatToMinutes(functionTimePilotInCommand)
		: undefined,
	functionCoPilot: functionTimeCoPilot
		? formatToMinutes(functionTimeCoPilot)
		: undefined,
	functionDual: functionTimeDual
		? formatToMinutes(functionTimeDual)
		: undefined,
	functionInstructor: functionTimeInstructor
		? formatToMinutes(functionTimeInstructor)
		: undefined,
});
