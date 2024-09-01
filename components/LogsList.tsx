import { auth } from "@/auth";
import { LogListTable } from "@/components/LogListTable";
import { db } from "@/db";
import { formatMinutes } from "@/helpers/formatMinutes";
import { fromDate, toCalendarDate, toTime } from "@internationalized/date";
import { notFound } from "next/navigation";

export const LogsList = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        notFound();
    }

    const logs = await db.query.logs.findMany({
        where: (logs, { eq }) => eq(logs.userId, userId),
        with: {
            aircraft: true,
            pilotInCommand: true,
            singularTimes: true,
        }
    });

    const tableData = logs.map(({ id, departureAt, arrivalAt, singularTimes, pilotInCommand, aircraft }) => {
        const departureDate = fromDate(departureAt, 'utc');
        const arrivalDate = fromDate(arrivalAt, 'utc');
        const date = toCalendarDate(departureDate);
        const departureTime = toTime(departureDate);
        const arrivalTime = toTime(arrivalDate);


        return ({
            id,
            date: date.toString(),
            departure: departureTime.toString().slice(0, 5),
            arrival: arrivalTime.toString().slice(0, 5),
            totalTime: formatMinutes(singularTimes.totalFlight),
            pic: pilotInCommand.name,
            aircraft: aircraft.model,
        });
    });

    return <LogListTable logs={tableData} />
};