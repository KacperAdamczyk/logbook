<script lang="ts">
	import { page } from "$app/state";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	interface Props {
		name: string;
		hasName: boolean;
		onSubmitSearch: (name: string) => void | Promise<void>;
		onClearSearch: () => void | Promise<void>;
	}

	const { name, hasName, onSubmitSearch, onClearSearch }: Props = $props();

	function parseNameSearch(value: FormDataEntryValue | null): string {
		if (typeof value !== "string") {
			return "";
		}

		return value.trim();
	}

	async function submitSearch(event: SubmitEvent): Promise<void> {
		event.preventDefault();

		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			return;
		}

		const formData = new FormData(form);
		await onSubmitSearch(parseNameSearch(formData.get("name")));
	}
</script>

<form
	method="GET"
	action={page.url.pathname}
	class="mb-6 rounded-md border p-4"
	onsubmit={submitSearch}
>
	<div class="mb-3 flex items-center justify-between gap-2">
		<h2 class="text-sm font-semibold">Search</h2>
		<div class="flex items-center gap-3">
			<button
				type="button"
				class="text-sm text-muted-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
				disabled={!hasName}
				onclick={onClearSearch}
			>
				Clear search
			</button>
			<button
				type="submit"
				class="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium shadow-xs hover:bg-accent"
			>
				Apply
			</button>
		</div>
	</div>

	<div class="max-w-md space-y-1">
		<Label for="places-search-name">Name</Label>
		<Input
			id="places-search-name"
			name="name"
			type="search"
			placeholder="Search places by name"
			value={name}
		/>
	</div>
</form>
