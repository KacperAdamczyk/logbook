<script lang="ts">
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs.remote";
	import { Temporal } from "@js-temporal/polyfill";
	import { formatMinutesToTime } from "$lib/utils/parse-duration/format-minutes-to-time";

	const logs = await getAllLogs();

	function formatDate(date: Date) {
		const instant = Temporal.Instant.fromEpochMilliseconds(date.getTime());
		const zonedDateTime = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId());
		return zonedDateTime.toPlainDate().toString();
	}

	function formatTime(date: Date | null) {
		if (!date) return "-";
		const instant = Temporal.Instant.fromEpochMilliseconds(date.getTime());
		const zonedDateTime = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId());
		return zonedDateTime.toPlainTime().toString().slice(0, 5);
	}
</script>

<div class="p-6">
	<div class="mb-6">
		<h1 class="mb-2 text-2xl font-bold">Logs</h1>
		<p class="text-muted-foreground">View and manage your flight and simulator logs.</p>
	</div>

	<div class="rounded-md border">
		<table class="w-full border-collapse">
			<thead>
				<tr class="border-b bg-muted/50">
					<th class="px-4 py-3 text-left text-sm font-medium">Date</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Type</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Departure</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Arrival</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Total Time</th>
					<th class="px-4 py-3 text-left text-sm font-medium">PIC Time</th>
					<th class="px-4 py-3 text-left text-sm font-medium">Remarks</th>
				</tr>
			</thead>
			<tbody>
				{#each logs as log}
					<tr class="border-b transition-colors hover:bg-muted/50">
						<td class="px-4 py-3 text-sm">{formatDate(log.date)}</td>
						<td class="px-4 py-3 text-sm">
							<span
								class="inline-flex rounded-full px-2 py-1 text-xs font-medium"
								class:bg-blue-100={log.type === "flight"}
								class:text-blue-800={log.type === "flight"}
								class:bg-purple-100={log.type === "simulator"}
								class:text-purple-800={log.type === "simulator"}
							>
								{log.type === "flight" ? "Flight" : "Simulator"}
							</span>
						</td>
						<td class="px-4 py-3 text-sm">{formatTime(log.departureAt)}</td>
						<td class="px-4 py-3 text-sm">{formatTime(log.arrivalAt)}</td>
						<td class="px-4 py-3 text-sm">
							{#if log.type === "flight" && log.totalFlightTime}
								{formatMinutesToTime(log.totalFlightTime)}
							{:else if log.type === "simulator" && log.simulatorTotalTime}
								{formatMinutesToTime(log.simulatorTotalTime)}
							{:else}
								-
							{/if}
						</td>
						<td class="px-4 py-3 text-sm">
							{#if log.functionPilotInCommandTime}
								{formatMinutesToTime(log.functionPilotInCommandTime)}
							{:else}
								-
							{/if}
						</td>
						<td class="px-4 py-3 text-sm text-muted-foreground">
							{log.remarks || "-"}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7" class="px-4 py-8 text-center text-sm text-muted-foreground">
							No logs found. Start by creating a flight or simulator log.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
