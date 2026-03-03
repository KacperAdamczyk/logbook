<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { PlacesSearch } from "$lib/components/places-search";
	import PaginationBar from "$lib/components/pagination-bar/pagination-bar.svelte";
	import * as Table from "$lib/components/ui/table";
	import { getPlacesList } from "$lib/remotes/places/get-places-list/get-places-list.remote";
	import { buildPageHref, getPaginationRange, parsePageSearchParam } from "$lib/utils/pagination";
	import { SvelteURLSearchParams } from "svelte/reactivity";

	const PAGE_SIZE = 25;

	const currentPage = $derived(parsePageSearchParam(page.url.searchParams.get("page")));
	const name = $derived(parseNameSearch(page.url.searchParams.get("name")));
	const hasName = $derived(name.length > 0);
	const placesPage = $derived(
		await getPlacesList({
			page: currentPage,
			pageSize: PAGE_SIZE,
			nameQuery: name || undefined,
		}),
	);
	const places = $derived(placesPage.items);
	const totalCount = $derived(placesPage.totalCount);
	const { totalPages, startIndex, endIndex } = $derived(
		getPaginationRange({
			currentPage,
			pageSize: PAGE_SIZE,
			totalCount,
			itemCount: places.length,
		}),
	);

	function parseNameSearch(value: string | null): string {
		return value?.trim() ?? "";
	}

	function buildSearchHref(url: URL, nameSearch: string): string {
		const nextUrl = new URL(url);
		const normalizedNameSearch = parseNameSearch(nameSearch);

		if (normalizedNameSearch) {
			nextUrl.searchParams.set("name", normalizedNameSearch);
		} else {
			nextUrl.searchParams.delete("name");
		}

		nextUrl.searchParams.delete("page");

		return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
	}

	function buildLogsFilterQuery(
		filterParam: "place" | "arrival" | "departure",
		placeId: string,
	): string {
		const searchParams = new SvelteURLSearchParams();
		searchParams.set(filterParam, placeId);

		return searchParams.toString();
	}

	async function navigateToLogs(filterParam: "place" | "arrival" | "departure", placeId: string) {
		const query = buildLogsFilterQuery(filterParam, placeId);

		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(`${resolve("/logs")}?${query}`);
	}

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

	async function navigateToSearch(nextNameSearch: string): Promise<void> {
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		await goto(buildSearchHref(page.url, nextNameSearch), {
			keepFocus: true,
			noScroll: true,
			replaceState: true,
		});
	}
</script>

<div class="p-6">
	<PlacesSearch
		{name}
		{hasName}
		onSubmitSearch={(nextName) => navigateToSearch(nextName)}
		onClearSearch={() => navigateToSearch("")}
	/>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head class="text-right">Arrivals</Table.Head>
					<Table.Head class="text-right">Departures</Table.Head>
					<Table.Head class="text-right">Total</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each places as place (place.id)}
					<Table.Row>
						<Table.Cell>
							<button
								type="button"
								class="underline-offset-4 hover:underline"
								onclick={() => void navigateToLogs("place", place.id)}
							>
								{place.name}
							</button>
						</Table.Cell>
						<Table.Cell class="text-right font-mono">
							<button
								type="button"
								class="underline-offset-4 hover:underline"
								onclick={() => void navigateToLogs("arrival", place.id)}
							>
								{place.arrivalsCount}
							</button>
						</Table.Cell>
						<Table.Cell class="text-right font-mono">
							<button
								type="button"
								class="underline-offset-4 hover:underline"
								onclick={() => void navigateToLogs("departure", place.id)}
							>
								{place.departuresCount}
							</button>
						</Table.Cell>
						<Table.Cell class="text-right font-mono">
							<button
								type="button"
								class="underline-offset-4 hover:underline"
								onclick={() => void navigateToLogs("place", place.id)}
							>
								{place.totalCount}
							</button>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={4} class="h-24 text-center">No places found.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

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
