import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "@tanstack/svelte-table";
import LogTypeBadge from "./log-type-badge.svelte";
import LogRoute from "./log-route.svelte";
import LogTime from "./log-time.svelte";

export type Log = {
	id: string;
	type: "flight" | "simulator";
	date: Date;
	departurePlaceId: string | null;
	arrivalPlaceId: string | null;
	aircraftId: string | null;
	totalFlightTime: number | null;
	simulatorType: string | null;
	simulatorTotalTime: number | null;
};

export const columns: ColumnDef<Log>[] = [
	{
		accessorKey: "date",
		header: "Date",
		cell: ({ row }) => {
			const date = row.getValue("date") as Date;
			return date.toLocaleDateString();
		},
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) =>
			renderComponent(LogTypeBadge, { type: row.getValue("type") as "flight" | "simulator" }),
	},
	{
		id: "route",
		header: "Route / Simulator",
		cell: ({ row }) =>
			renderComponent(LogRoute, {
				type: row.original.type,
				departurePlaceId: row.original.departurePlaceId,
				arrivalPlaceId: row.original.arrivalPlaceId,
				simulatorType: row.original.simulatorType,
			}),
	},
	{
		id: "totalTime",
		header: "Total Time",
		cell: ({ row }) =>
			renderComponent(LogTime, {
				type: row.original.type,
				totalFlightTime: row.original.totalFlightTime,
				simulatorTotalTime: row.original.simulatorTotalTime,
			}),
	},
];
