<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { goto } from "$app/navigation";
	import LogTypeBadge from "./log-type-badge.svelte";
	import LogTime from "./log-time.svelte";

	export interface Log {
		id: string;
		type: "flight" | "simulator";
		date: Date;
		departureAt: Date | null;
		arrivalAt: Date | null;
		departurePlaceId: string | null;
		arrivalPlaceId: string | null;
		aircraftId: string | null;
		totalFlightTime: number | null;
		simulatorType: string | null;
		simulatorTotalTime: number | null;
	}

	interface Props {
		logs: Log[];
		places: Map<string, string>;
	}

	const { logs, places }: Props = $props();
	const dateFormatter = new Intl.DateTimeFormat();
	const utcTimeFormatter = new Intl.DateTimeFormat(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
		timeZone: "UTC",
	});

	function handleRowClick(log: Log) {
		if (log.type === "flight") {
			goto(`/logs/flights/${log.id}`);
		}
		// TODO: Add simulator detail page navigation when available
	}

	function formatUtcTime(value: Date | null): string {
		return value ? utcTimeFormatter.format(value) : "—";
	}

	function formatDate(value: Date): string {
		return dateFormatter.format(value);
	}

	function getPlaceName(placeId: string | null): string {
		if (!placeId) {
			return "—";
		}

		return places.get(placeId) ?? "—";
	}
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>From</Table.Head>
				<Table.Head>To</Table.Head>
				<Table.Head>Date</Table.Head>
				<Table.Head>Departure</Table.Head>
				<Table.Head>Arrival</Table.Head>
				<Table.Head>Total Flight Time</Table.Head>
				<Table.Head>Type</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each logs as log (log.id)}
				<Table.Row
					class={log.type === "flight" ? "cursor-pointer hover:bg-muted/50" : undefined}
					onclick={() => handleRowClick(log)}
				>
					<Table.Cell class="font-mono text-sm">{getPlaceName(log.departurePlaceId)}</Table.Cell>
					<Table.Cell class="font-mono text-sm">{getPlaceName(log.arrivalPlaceId)}</Table.Cell>
					<Table.Cell>{formatDate(log.date)}</Table.Cell>
					<Table.Cell class="font-mono text-sm">{formatUtcTime(log.departureAt)}</Table.Cell>
					<Table.Cell class="font-mono text-sm">{formatUtcTime(log.arrivalAt)}</Table.Cell>
					<Table.Cell>
						<LogTime
							type={log.type}
							totalFlightTime={log.totalFlightTime}
							simulatorTotalTime={log.simulatorTotalTime}
						/>
					</Table.Cell>
					<Table.Cell>
						<LogTypeBadge type={log.type} />
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={7} class="h-24 text-center">No logs found.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
