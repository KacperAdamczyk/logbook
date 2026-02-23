<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import { LogsTable } from "$lib/components/logs-table";
	import PaginationBar from "$lib/components/pagination-bar/pagination-bar.svelte";
	import { getAllAircraft } from "$lib/remotes/aircraft/get-all-aircraft/get-all-aircraft.remote";
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs/get-all-logs.remote";
	import { getAllPilots } from "$lib/remotes/pilots/get-all-pilots/get-all-pilots.remote";
	import { getAllPlaces } from "$lib/remotes/places/get-all-places/get-all-places.remote";
	import { buildPageHref, getPaginationRange, parsePageSearchParam } from "$lib/utils/pagination";

	const PAGE_SIZE = 25;

	const currentPage = $derived(parsePageSearchParam(page.url.searchParams.get("page")));

	const [placeList, aircraftList, pilotList] = await Promise.all([
		getAllPlaces(),
		getAllAircraft(),
		getAllPilots(),
	]);
	const logsPage = $derived(await getAllLogs({ page: currentPage, pageSize: PAGE_SIZE }));
	const logs = $derived(logsPage.items);
	const totalCount = $derived(logsPage.totalCount);
	const { totalPages, startIndex, endIndex } = $derived(
		getPaginationRange({
			currentPage,
			pageSize: PAGE_SIZE,
			totalCount,
			itemCount: logs.length,
		}),
	);

	const places = new Map(placeList.map((place) => [place.id, place.name]));
	const aircraft = new Map(
		aircraftList.map((item) => [item.id, { model: item.model, registration: item.registration }]),
	);
	const pilots = new Map(pilotList.map((item) => [item.id, item.name]));

	async function navigateToPage(nextPage: number, replaceState = false): Promise<void> {
		const normalizedPage = Math.max(1, Math.min(nextPage, totalPages));

		if (normalizedPage === currentPage) {
			return;
		}

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(buildPageHref(page.url, normalizedPage), {
			keepFocus: true,
			noScroll: true,
			replaceState,
		});
	}
</script>

<div class="p-6">
	<h1 class="mb-2 text-2xl font-bold">Logs</h1>
	<p class="mb-6 text-muted-foreground">View and manage your flight and simulator logs.</p>

	<LogsTable {logs} {places} {aircraft} {pilots} />
	<PaginationBar
		{totalCount}
		pageSize={PAGE_SIZE}
		{currentPage}
		{totalPages}
		{startIndex}
		{endIndex}
		onPageChange={navigateToPage}
	/>
</div>
