<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
	import ClearIcon from "@lucide/svelte/icons/x-circle";
	import { tick } from "svelte";
	import * as Command from "$lib/components/ui/command/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils.js";

	interface Props {
		id?: string;
		name: string;
		items: { value: string; label: string }[];
		value: string | number;
		placeholder: string;
		maxVisibleItems?: number;
	}

	let {
		id,
		name,
		items,
		value = $bindable(""),
		placeholder,
		maxVisibleItems = 50,
	}: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const normalizedQuery = $derived(value.toString().trim().toLowerCase());
	const filteredItems = $derived.by(() => {
		if (!normalizedQuery) {
			return items;
		}

		return items.filter((item) => {
			const valueMatch = item.value.toLowerCase().includes(normalizedQuery);
			const labelMatch = item.label.toLowerCase().includes(normalizedQuery);

			return valueMatch || labelMatch;
		});
	});
	const visibleItems = $derived(filteredItems.slice(0, maxVisibleItems));
	const hasMoreMatches = $derived(filteredItems.length > maxVisibleItems);
</script>

<input type="hidden" {id} {name} bind:value />
<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class="justify-between"
				role="combobox"
				aria-expanded={open}
			>
				{#if value}
					<div class="grow text-left">{value}</div>
					<span
						role="button"
						tabindex="0"
						aria-label="Clear selection"
						onclick={(e) => {
							value = "";
							e.stopPropagation();
						}}
						onkeydown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								value = "";
								e.stopPropagation();
								e.preventDefault();
							}
						}}
					>
						<ClearIcon class="opacity-50" />
					</span>
				{:else}
					<span class="text-muted-foreground">{placeholder}</span>
				{/if}
				<ChevronsUpDownIcon class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="p-0">
		<Command.Root>
			<Command.Input
				{placeholder}
				bind:value={
					() => value.toString(),
					(v) => {
						value = v.toUpperCase();
					}
				}
			/>
			<Command.List>
				<Command.Group value="frameworks">
					{#each visibleItems as item (item.value)}
						<Command.Item
							value={item.value}
							onSelect={() => {
								value = item.value;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn(value !== item.value && "text-transparent")} />
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if hasMoreMatches}
					<div class="px-2 py-1.5 text-xs text-muted-foreground">
						Showing first {maxVisibleItems} matches. Keep typing to narrow.
					</div>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
