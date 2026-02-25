<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import type { LogsListFilters } from "$lib/utils/logs-filters";

	export interface FilterSelectOption {
		id: string;
		label: string;
	}

	interface Props {
		filters: LogsListFilters;
		hasFilters: boolean;
		placeOptions: FilterSelectOption[];
		pilotOptions: FilterSelectOption[];
		aircraftOptions: FilterSelectOption[];
		onApplyFilters: (filters: LogsListFilters) => void | Promise<void>;
		onClearFilters: () => void | Promise<void>;
	}

	const {
		filters,
		hasFilters,
		placeOptions,
		pilotOptions,
		aircraftOptions,
		onApplyFilters,
		onClearFilters,
	}: Props = $props();

	const selectClass =
		"flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs ring-offset-background transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

	function getFormValue(formData: FormData, key: keyof LogsListFilters): string | undefined {
		const value = formData.get(key);

		if (typeof value !== "string") {
			return undefined;
		}

		const normalized = value.trim();

		return normalized || undefined;
	}

	async function submitFilters(event: SubmitEvent): Promise<void> {
		event.preventDefault();

		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		const formData = new FormData(form);
		await onApplyFilters({
			dateFrom: getFormValue(formData, "dateFrom"),
			dateTo: getFormValue(formData, "dateTo"),
			departurePlaceId: getFormValue(formData, "departurePlaceId"),
			arrivalPlaceId: getFormValue(formData, "arrivalPlaceId"),
			pilotInCommandId: getFormValue(formData, "pilotInCommandId"),
			aircraftId: getFormValue(formData, "aircraftId"),
		});
	}
</script>

<form class="mb-6 rounded-md border p-4" onsubmit={submitFilters}>
	<div class="mb-3 flex items-center justify-between gap-2">
		<h2 class="text-sm font-semibold">Filters</h2>
		<div class="flex items-center gap-3">
			<button
				type="button"
				class="text-sm text-muted-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
				disabled={!hasFilters}
				onclick={onClearFilters}
			>
				Clear filters
			</button>
			<button
				type="submit"
				class="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium shadow-xs hover:bg-accent"
			>
				Apply
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
		<div class="space-y-1">
			<Label for="logs-filter-date-from">Date from</Label>
			<Input id="logs-filter-date-from" name="dateFrom" type="date" value={filters.dateFrom ?? ""} />
		</div>

		<div class="space-y-1">
			<Label for="logs-filter-date-to">Date to</Label>
			<Input id="logs-filter-date-to" name="dateTo" type="date" value={filters.dateTo ?? ""} />
		</div>

		<div class="space-y-1">
			<Label for="logs-filter-departure">Departure</Label>
			<select
				id="logs-filter-departure"
				name="departurePlaceId"
				class={selectClass}
				value={filters.departurePlaceId ?? ""}
			>
				<option value="">Any departure</option>
				{#each placeOptions as placeOption (placeOption.id)}
					<option value={placeOption.id}>{placeOption.label}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-1">
			<Label for="logs-filter-arrival">Arrival</Label>
			<select
				id="logs-filter-arrival"
				name="arrivalPlaceId"
				class={selectClass}
				value={filters.arrivalPlaceId ?? ""}
			>
				<option value="">Any arrival</option>
				{#each placeOptions as placeOption (placeOption.id)}
					<option value={placeOption.id}>{placeOption.label}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-1">
			<Label for="logs-filter-pic">PIC</Label>
			<select
				id="logs-filter-pic"
				name="pilotInCommandId"
				class={selectClass}
				value={filters.pilotInCommandId ?? ""}
			>
				<option value="">Any PIC</option>
				{#each pilotOptions as pilotOption (pilotOption.id)}
					<option value={pilotOption.id}>{pilotOption.label}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-1">
			<Label for="logs-filter-aircraft">Aircraft</Label>
			<select
				id="logs-filter-aircraft"
				name="aircraftId"
				class={selectClass}
				value={filters.aircraftId ?? ""}
			>
				<option value="">Any aircraft</option>
				{#each aircraftOptions as aircraftOption (aircraftOption.id)}
					<option value={aircraftOption.id}>{aircraftOption.label}</option>
				{/each}
			</select>
		</div>
	</div>
</form>
