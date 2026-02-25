<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { LogsFilters, type FilterSelectOption } from "$lib/components/logs-filters";
	import { LogsTable } from "$lib/components/logs-table";
	import PaginationBar from "$lib/components/pagination-bar/pagination-bar.svelte";
	import { getAllAircraft } from "$lib/remotes/aircraft/get-all-aircraft/get-all-aircraft.remote";
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs/get-all-logs.remote";
	import { getAllPilots } from "$lib/remotes/pilots/get-all-pilots/get-all-pilots.remote";
	import { getAllPlaces } from "$lib/remotes/places/get-all-places/get-all-places.remote";
	import {
		buildLogsFiltersHref,
		hasActiveLogsFilters,
		parseLogsFiltersSearchParams,
		type LogsListFilters,
	} from "$lib/utils/logs-filters";
	import { buildPageHref, getPaginationRange, parsePageSearchParam } from "$lib/utils/pagination";

	const PAGE_SIZE = 25;

	const currentPage = $derived(parsePageSearchParam(page.url.searchParams.get("page")));
	const filters = $derived(parseLogsFiltersSearchParams(page.url.searchParams));

	const [placeList, aircraftList, pilotList] = await Promise.all([
		getAllPlaces(),
		getAllAircraft(),
		getAllPilots(),
	]);
	const logsPage = $derived(await getAllLogs({ page: currentPage, pageSize: PAGE_SIZE, filters }));
	const logs = $derived(logsPage.items);
	const totalCount = $derived(logsPage.totalCount);
	const hasFilters = $derived(hasActiveLogsFilters(filters));
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
	const placeOptions: FilterSelectOption[] = placeList
		.map((item) => ({ id: item.id, label: item.name }))
		.toSorted((a, b) => a.label.localeCompare(b.label));
	const aircraftOptions = aircraftList
		.map((item) => ({
			id: item.id,
			label: `${item.model} / ${item.registration}`,
		}))
		.toSorted((a, b) => a.label.localeCompare(b.label));
	const pilotOptions: FilterSelectOption[] = pilotList
		.map((item) => ({ id: item.id, label: item.name }))
		.toSorted((a, b) => a.label.localeCompare(b.label));

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

	async function navigateToFilters(nextFilters: LogsListFilters): Promise<void> {
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(buildLogsFiltersHref(page.url, nextFilters), {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
		});
	}

	async function clearFilters(): Promise<void> {
		if (!hasFilters) {
			return;
		}

		await navigateToFilters({});
	}
</script>

<div class="p-6">
	<h1 class="mb-2 text-2xl font-bold">Logs</h1>
	<p class="mb-6 text-muted-foreground">View and manage your flight and simulator logs.</p>

	<LogsFilters
		{filters}
		hasFilters={hasFilters}
		{placeOptions}
		{pilotOptions}
		{aircraftOptions}
		onApplyFilters={navigateToFilters}
		onClearFilters={clearFilters}
	/>

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
