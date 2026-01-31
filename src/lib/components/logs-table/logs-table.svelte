<script lang="ts">
	import { createSvelteTable, getCoreRowModel, getSortedRowModel } from "@tanstack/svelte-table";
	import type { SortingState } from "@tanstack/table-core";
	import { columns, type Log } from "./columns";
	import * as Table from "$lib/components/ui/table";
	import FlexRender from "./flex-render.svelte";

	interface Props {
		data: Log[];
	}

	const { data }: Props = $props();

	let sorting: SortingState = $state([{ id: "date", desc: true }]);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		state: {
			get sorting() {
				return sorting;
			},
		},
	});

	function handleRowClick(log: Log) {
		if (log.type === "flight") {
			// redirect(`/logs/flights/${log.id}`);
		}
		// TODO: Add simulator detail page navigation when available
	}
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each $table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each $table.getRowModel().rows as row (row.id)}
				<Table.Row
					class="cursor-pointer hover:bg-muted/50"
					onclick={() => handleRowClick(row.original)}
				>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No logs found.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
