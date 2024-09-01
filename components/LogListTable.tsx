"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/table";
import type { FC } from "react";

export interface TableLog {
	id: string;
	date: string;
	departure: string;
	arrival: string;
	totalTime: string;
	pic: string;
	aircraft: string;
}

interface LogListTableProps {
	logs: TableLog[];
}

export const LogListTable: FC<LogListTableProps> = ({ logs }) => {
	return (
		<Table aria-label="Logs List" isStriped>
			<TableHeader>
				<TableColumn>Date</TableColumn>
				<TableColumn>Departure</TableColumn>
				<TableColumn>Arrival</TableColumn>
				<TableColumn>Total Time</TableColumn>
				<TableColumn>PIC</TableColumn>
				<TableColumn className="hidden md:table-cell">Aircraft</TableColumn>
			</TableHeader>
			<TableBody emptyContent="No logs yet.">
				{logs.map((log) => (
					<TableRow key={log.id}>
						<TableCell>{log.date}</TableCell>
						<TableCell>{log.departure}</TableCell>
						<TableCell>{log.arrival}</TableCell>
						<TableCell>{log.totalTime}</TableCell>
						<TableCell>{log.pic}</TableCell>
						<TableCell className="hidden md:table-cell">
							{log.aircraft}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
