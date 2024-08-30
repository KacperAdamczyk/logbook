import type  {Log} from "@/db/schema/logs";
import { createDbAction } from "@/db/utils";

export interface GetOverlappingLogsArgs {
    departure: Date;
    arrival: Date;
}


export const getOverlappingLogs = createDbAction<GetOverlappingLogsArgs, Log[]>(async (tx, {departure, arrival}) => tx.query.logs.findMany({
    where: (logs, { and, lt, gt }) => and(
        lt(logs.departureAt, arrival),
        gt(logs.arrivalAt, departure)
    ),
}));