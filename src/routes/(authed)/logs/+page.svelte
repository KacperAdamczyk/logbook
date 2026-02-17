<script lang="ts">
	import { LogsTable } from "$lib/components/logs-table";
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs/get-all-logs.remote";
	import { getAllPlaces } from "$lib/remotes/places/get-all-places/get-all-places.remote";

	const [logs, places] = await Promise.all([getAllLogs(), getAllPlaces()]);

	const placesById = $derived(new Map(places.map((place) => [place.id, place.name])));
</script>

<div class="p-6">
	<h1 class="mb-2 text-2xl font-bold">Logs</h1>
	<p class="mb-6 text-muted-foreground">View and manage your flight and simulator logs.</p>

	<LogsTable logs={logs} places={placesById} />
</div>
