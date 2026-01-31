<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { goto } from "$app/navigation";
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

	interface Props {
		data: Log[];
	}

	const { data }: Props = $props();

	const sortedData = $derived(data.toSorted((a, b) => b.date.getTime() - a.date.getTime()));

	function handleRowClick(log: Log) {
		if (log.type === "flight") {
			goto(`/logs/flights/${log.id}`);
		}
		// TODO: Add simulator detail page navigation when available
	}

	function formatDate(date: Date): string {
		return date.toLocaleDateString();
	}
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Date</Table.Head>
				<Table.Head>Type</Table.Head>
				<Table.Head>Route / Simulator</Table.Head>
				<Table.Head>Total Time</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each sortedData as log (log.id)}
				<Table.Row class="cursor-pointer hover:bg-muted/50" onclick={() => handleRowClick(log)}>
					<Table.Cell>{formatDate(log.date)}</Table.Cell>
					<Table.Cell>
						<LogTypeBadge type={log.type} />
					</Table.Cell>
					<Table.Cell>
						<LogRoute
							type={log.type}
							departurePlaceId={log.departurePlaceId}
							arrivalPlaceId={log.arrivalPlaceId}
							simulatorType={log.simulatorType}
						/>
					</Table.Cell>
					<Table.Cell>
						<LogTime
							type={log.type}
							totalFlightTime={log.totalFlightTime}
							simulatorTotalTime={log.simulatorTotalTime}
						/>
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={4} class="h-24 text-center">No logs found.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
