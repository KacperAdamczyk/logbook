import { logs, type Log } from "@/db/schema/logs";
import { createDbAction } from "@/db/utils";
import { and, eq, gte, lte, between } from "drizzle-orm";

export interface GetOverlappingLogsParams {
    departure: Date;
    arrival: Date;
}


export const getOverlappingLogs = createDbAction<GetOverlappingLogsParams, Log[]>(async (tx, {departure, arrival}) => tx.query.logs.findMany({
    where: and(
        lte(logs.departureAt, arrival),
        gte(logs.arrivalAt, departure)
    ),
}));