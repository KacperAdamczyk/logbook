<script lang="ts">
	import { LogsTable } from "$lib/components/logs-table";
	import { getAllAircraft } from "$lib/remotes/aircraft/get-all-aircraft/get-all-aircraft.remote";
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs/get-all-logs.remote";
	import { getAllPlaces } from "$lib/remotes/places/get-all-places/get-all-places.remote";

	const [logs, places, aircraft] = await Promise.all([getAllLogs(), getAllPlaces(), getAllAircraft()]);

	const placesById = $derived(new Map(places.map((place) => [place.id, place.name])));
	const aircraftById = $derived(new Map(aircraft.map((item) => [item.id, item.model])));
</script>

<div class="p-6">
	<h1 class="mb-2 text-2xl font-bold">Logs</h1>
	<p class="mb-6 text-muted-foreground">View and manage your flight and simulator logs.</p>

	<LogsTable logs={logs} places={placesById} aircraftById={aircraftById} />
</div>
