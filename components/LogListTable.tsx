"use client";

import { Button, Link } from "@nextui-org/react";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/table";
import { IconEye } from "@tabler/icons-react";
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
		<Table
			aria-label="Logs List"
			isStriped
			selectionMode="single"
			color="success"
		>
			<TableHeader>
				<TableColumn>Date</TableColumn>
				<TableColumn>Departure</TableColumn>
				<TableColumn>Arrival</TableColumn>
				<TableColumn>Total Time</TableColumn>
				<TableColumn className="hidden md:table-cell">PIC</TableColumn>
				<TableColumn className="hidden md:table-cell">Aircraft</TableColumn>
				<TableColumn>Actions</TableColumn>
			</TableHeader>
			<TableBody emptyContent="No logs yet.">
				{logs.map((log) => (
					<TableRow key={log.id}>
						<TableCell>{log.date}</TableCell>
						<TableCell>{log.departure}</TableCell>
						<TableCell>{log.arrival}</TableCell>
						<TableCell>{log.totalTime}</TableCell>
						<TableCell className="hidden md:table-cell">{log.pic}</TableCell>
						<TableCell className="hidden md:table-cell">
							{log.aircraft}
						</TableCell>
						<TableCell>
							<Button
								as={Link}
								href={`/logs/${log.id}`}
								isIconOnly
								variant="flat"
								color="success"
							>
								<IconEye />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
