<script lang="ts">
	import { LogsTable } from "$lib/components/logs-table";
	import { getAllAircraft } from "$lib/remotes/aircraft/get-all-aircraft/get-all-aircraft.remote";
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs/get-all-logs.remote";
	import { getAllPilots } from "$lib/remotes/pilots/get-all-pilots/get-all-pilots.remote";
	import { getAllPlaces } from "$lib/remotes/places/get-all-places/get-all-places.remote";

	const [logs, placeList, aircraftList, pilotList] = await Promise.all([
		getAllLogs(),
		getAllPlaces(),
		getAllAircraft(),
		getAllPilots(),
	]);

	const places = $derived(new Map(placeList.map((place) => [place.id, place.name])));
	const aircraft = $derived(
		new Map(
			aircraftList.map((item) => [item.id, { model: item.model, registration: item.registration }]),
		),
	);
	const pilots = $derived(new Map(pilotList.map((item) => [item.id, item.name])));
</script>

<div class="p-6">
	<h1 class="mb-2 text-2xl font-bold">Logs</h1>
	<p class="mb-6 text-muted-foreground">View and manage your flight and simulator logs.</p>

	<LogsTable {logs} {places} {aircraft} {pilots} />
</div>
