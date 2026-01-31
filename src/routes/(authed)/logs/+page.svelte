<script lang="ts">
	// import { LogsTable } from "$lib/components/logs-table";
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs/get-all-logs.remote";

	const logs = $derived(await getAllLogs());
</script>

<div class="p-6">
	<h1 class="mb-2 text-2xl font-bold">Logs</h1>
	<p class="mb-6 text-muted-foreground">View and manage your flight and simulator logs.</p>

	<!-- <LogsTable data={logs} /> -->
</div>
