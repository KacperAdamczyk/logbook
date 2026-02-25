<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { LogsTable } from "$lib/components/logs-table";
	import PaginationBar from "$lib/components/pagination-bar/pagination-bar.svelte";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { getAllAircraft } from "$lib/remotes/aircraft/get-all-aircraft/get-all-aircraft.remote";
	import { getAllLogs } from "$lib/remotes/logs/get-all-logs/get-all-logs.remote";
	import { getAllPilots } from "$lib/remotes/pilots/get-all-pilots/get-all-pilots.remote";
	import { getAllPlaces } from "$lib/remotes/places/get-all-places/get-all-places.remote";
	import {
		areLogsFiltersEqual,
		buildLogsFiltersHref,
		hasActiveLogsFilters,
		parseLogsFiltersSearchParams,
		type LogsListFilters,
	} from "$lib/utils/logs-filters";
	import { buildPageHref, getPaginationRange, parsePageSearchParam } from "$lib/utils/pagination";

	const PAGE_SIZE = 25;
	const selectClass =
		"flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

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
	const placeOptions = [...placeList].sort((a, b) => a.name.localeCompare(b.name));
	const aircraftOptions = [...aircraftList]
		.map((item) => ({
			id: item.id,
			label: `${item.model} / ${item.registration}`,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));
	const pilotOptions = [...pilotList].sort((a, b) => a.name.localeCompare(b.name));

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
		if (areLogsFiltersEqual(filters, nextFilters)) {
			return;
		}

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(buildLogsFiltersHref(page.url, nextFilters), {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
		});
	}

	function getControlValue(event: Event): string | undefined {
		const target = event.currentTarget;

		if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) {
			return undefined;
		}

		return target.value.trim() || undefined;
	}

	async function updateFilter<K extends keyof LogsListFilters>(key: K, value: LogsListFilters[K]) {
		await navigateToFilters({
			...filters,
			[key]: value,
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

	<div class="mb-6 rounded-md border p-4">
		<div class="mb-3 flex items-center justify-between gap-2">
			<h2 class="text-sm font-semibold">Filters</h2>
			<button
				type="button"
				class="text-sm text-muted-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
				disabled={!hasFilters}
				onclick={clearFilters}
			>
				Clear filters
			</button>
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
			<div class="space-y-1">
				<Label for="logs-filter-date-from">Date from</Label>
				<Input
					id="logs-filter-date-from"
					type="date"
					value={filters.dateFrom ?? ""}
					onchange={(event) => updateFilter("dateFrom", getControlValue(event))}
				/>
			</div>

			<div class="space-y-1">
				<Label for="logs-filter-date-to">Date to</Label>
				<Input
					id="logs-filter-date-to"
					type="date"
					value={filters.dateTo ?? ""}
					onchange={(event) => updateFilter("dateTo", getControlValue(event))}
				/>
			</div>

			<div class="space-y-1">
				<Label for="logs-filter-departure">Departure</Label>
				<select
					id="logs-filter-departure"
					class={selectClass}
					value={filters.departurePlaceId ?? ""}
					onchange={(event) => updateFilter("departurePlaceId", getControlValue(event))}
				>
					<option value="">Any departure</option>
					{#each placeOptions as placeOption (placeOption.id)}
						<option value={placeOption.id}>{placeOption.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1">
				<Label for="logs-filter-arrival">Arrival</Label>
				<select
					id="logs-filter-arrival"
					class={selectClass}
					value={filters.arrivalPlaceId ?? ""}
					onchange={(event) => updateFilter("arrivalPlaceId", getControlValue(event))}
				>
					<option value="">Any arrival</option>
					{#each placeOptions as placeOption (placeOption.id)}
						<option value={placeOption.id}>{placeOption.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1">
				<Label for="logs-filter-pic">PIC</Label>
				<select
					id="logs-filter-pic"
					class={selectClass}
					value={filters.pilotInCommandId ?? ""}
					onchange={(event) => updateFilter("pilotInCommandId", getControlValue(event))}
				>
					<option value="">Any PIC</option>
					{#each pilotOptions as pilotOption (pilotOption.id)}
						<option value={pilotOption.id}>{pilotOption.name}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1">
				<Label for="logs-filter-aircraft">Aircraft</Label>
				<select
					id="logs-filter-aircraft"
					class={selectClass}
					value={filters.aircraftId ?? ""}
					onchange={(event) => updateFilter("aircraftId", getControlValue(event))}
				>
					<option value="">Any aircraft</option>
					{#each aircraftOptions as aircraftOption (aircraftOption.id)}
						<option value={aircraftOption.id}>{aircraftOption.label}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

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
