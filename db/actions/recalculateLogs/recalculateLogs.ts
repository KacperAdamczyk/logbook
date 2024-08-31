import { times, type Time } from "@/db/schema";
import { createDbAction } from "@/db/utils";
import { eq } from "drizzle-orm";

const defaultTimes = {
    totalFlight: 0,
    singlePilotSingleEngine: 0,
    singlePilotMultiEngine: 0,
    multiPilot: 0,
    operationalConditionNight: 0,
    operationalConditionIfr: 0,
    functionPilotInCommand: 0,
    functionCoPilot: 0,
    functionDual: 0,
    functionInstructor: 0,
} satisfies Omit<Time, "id">;

interface RecalculateLogsArgs {
    userId: string;
    since: Date;
}

export const recalculateLogs = createDbAction<RecalculateLogsArgs, Time[]>(async (tx, {userId, since}) => {
    const logsToUpdate = await tx.query.logs.findMany({
        where: (logs, { eq, gte, and }) => and(eq(logs.userId, userId), gte(logs.departureAt, since)),
        with: {
            singularTimes: true,
            cumulatedTimes: true,
        }
    });

    const startLog = await tx.query.logs.findFirst({
        where: (logs, { eq, lt, and }) => and(eq(logs.userId, userId), lt(logs.departureAt, since)),
        orderBy: (logs, { desc }) => [desc(logs.departureAt)],
        with: {
            cumulatedTimes: true,
        },
    })

    const updatedTimes: Time[] = [];
    let lastTimes = startLog?.cumulatedTimes ?? defaultTimes;

    for (const {singularTimes, cumulatedTimes} of logsToUpdate) {
       const updatedTimeValues = {
        totalFlight: lastTimes.totalFlight + singularTimes.totalFlight,
        singlePilotSingleEngine: lastTimes.singlePilotSingleEngine + singularTimes.singlePilotSingleEngine,
        singlePilotMultiEngine: lastTimes.singlePilotMultiEngine + singularTimes.singlePilotMultiEngine,
        multiPilot: lastTimes.multiPilot + singularTimes.multiPilot,
        operationalConditionNight: lastTimes.operationalConditionNight + singularTimes.operationalConditionNight,
        operationalConditionIfr: lastTimes.operationalConditionIfr + singularTimes.operationalConditionIfr,
        functionPilotInCommand: lastTimes.functionPilotInCommand + singularTimes.functionPilotInCommand,
        functionCoPilot: lastTimes.functionCoPilot + singularTimes.functionCoPilot,
        functionDual: lastTimes.functionDual + singularTimes.functionDual,
        functionInstructor: lastTimes.functionInstructor + singularTimes.functionInstructor,
       } satisfies Omit<Time, "id">; 

       const [updatedTime] = await tx.update(times).set(updatedTimeValues).where(eq(times.id, cumulatedTimes.id)).returning();

       lastTimes = updatedTime;
       updatedTimes.push(updatedTime);
    }

    return updatedTimes;
})
