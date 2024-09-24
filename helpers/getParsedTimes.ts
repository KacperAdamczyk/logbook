import type { LogFormValues } from "@/actions/validation/logFormSchema";
import { timeToMinutes } from "@/helpers/timeToMinutes";

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
	totalFlight: timeToMinutes(totalFlightTime),
	singlePilotSingleEngine: singlePilotTimeSingleEngine
		? timeToMinutes(singlePilotTimeSingleEngine)
		: undefined,
	singlePilotMultiEngine: singlePilotTimeMultiEngine
		? timeToMinutes(singlePilotTimeMultiEngine)
		: undefined,
	multiPilot: multiPilotTime ? timeToMinutes(multiPilotTime) : undefined,
	operationalConditionNight: operationalConditionTimeNight
		? timeToMinutes(operationalConditionTimeNight)
		: undefined,
	operationalConditionIfr: operationalConditionTimeIfr
		? timeToMinutes(operationalConditionTimeIfr)
		: undefined,
	functionPilotInCommand: functionTimePilotInCommand
		? timeToMinutes(functionTimePilotInCommand)
		: undefined,
	functionCoPilot: functionTimeCoPilot
		? timeToMinutes(functionTimeCoPilot)
		: undefined,
	functionDual: functionTimeDual ? timeToMinutes(functionTimeDual) : undefined,
	functionInstructor: functionTimeInstructor
		? timeToMinutes(functionTimeInstructor)
		: undefined,
});
