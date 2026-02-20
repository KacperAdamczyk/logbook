<script lang="ts">
	import * as Table from "$lib/components/ui/table";
	import { goto } from "$app/navigation";
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
		aircraftById: Map<string, string>;
	}

	const { logs, places, aircraftById }: Props = $props();
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

	function getAircraftModel(aircraftId: string | null): string {
		if (!aircraftId) {
			return "—";
		}

		return aircraftById.get(aircraftId) ?? "—";
	}

	function getPlaceName(placeId: string | null): string {
		if (!placeId) {
			return "—";
		}

		return places.get(placeId) ?? "—";
	}

	function formatRoute(departurePlaceId: string | null, arrivalPlaceId: string | null): string {
		const from = getPlaceName(departurePlaceId);
		const to = getPlaceName(arrivalPlaceId);

		if (from === "—" && to === "—") {
			return "—";
		}

		return `${from} → ${to}`;
	}
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Date</Table.Head>
				<Table.Head class="md:hidden">Route</Table.Head>
				<Table.Head class="hidden md:table-cell">From</Table.Head>
				<Table.Head class="hidden md:table-cell">Dep</Table.Head>
				<Table.Head class="hidden md:table-cell">To</Table.Head>
				<Table.Head class="hidden md:table-cell">Arr</Table.Head>
				<Table.Head>TFT</Table.Head>
				<Table.Head class="hidden md:table-cell">AC</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each logs as log (log.id)}
				<Table.Row
					class={log.type === "flight"
						? "cursor-pointer border-l-4 border-l-blue-500"
						: "border-l-4 border-l-amber-500"}
					onclick={() => handleRowClick(log)}
					title={log.type === "flight" ? "Flight log" : "Simulator log"}
					aria-label={log.type === "flight" ? "Flight log" : "Simulator log"}
				>
					<Table.Cell>{formatDate(log.date)}</Table.Cell>
					<Table.Cell class="font-mono text-sm md:hidden">
						{formatRoute(log.departurePlaceId, log.arrivalPlaceId)}
					</Table.Cell>
					<Table.Cell class="hidden font-mono text-sm md:table-cell">
						{getPlaceName(log.departurePlaceId)}
					</Table.Cell>
					<Table.Cell class="hidden font-mono text-sm md:table-cell">
						{formatUtcTime(log.departureAt)}
					</Table.Cell>
					<Table.Cell class="hidden font-mono text-sm md:table-cell">
						{getPlaceName(log.arrivalPlaceId)}
					</Table.Cell>
					<Table.Cell class="hidden font-mono text-sm md:table-cell">
						{formatUtcTime(log.arrivalAt)}
					</Table.Cell>
					<Table.Cell>
						<LogTime
							type={log.type}
							totalFlightTime={log.totalFlightTime}
							simulatorTotalTime={log.simulatorTotalTime}
						/>
					</Table.Cell>
					<Table.Cell class="hidden md:table-cell">
						{getAircraftModel(log.aircraftId)}
					</Table.Cell>
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={8} class="h-24 text-center">No logs found.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
