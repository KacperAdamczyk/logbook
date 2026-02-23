<script lang="ts">
	import * as Pagination from "$lib/components/ui/pagination";

	interface Props {
		totalCount: number;
		pageSize: number;
		currentPage: number;
		totalPages: number;
		startIndex: number;
		endIndex: number;
		onPageChange: (page: number) => void | Promise<void>;
	}

	const {
		totalCount,
		pageSize,
		currentPage,
		totalPages,
		startIndex,
		endIndex,
		onPageChange,
	}: Props = $props();
</script>

{#if totalCount > 0}
	<div
		class="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start"
	>
		<p class="text-sm text-muted-foreground">Showing {startIndex}–{endIndex} of {totalCount}</p>

		{#if totalCount > pageSize}
			<Pagination.Root
				count={totalCount}
				perPage={pageSize}
				page={Math.min(currentPage, totalPages)}
				onPageChange={(page) => void onPageChange(page)}
				class="mx-0 w-auto"
			>
				{#snippet children({ pages, currentPage: paginationPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.Previous />
						</Pagination.Item>

						{#each pages as item (item.key)}
							<Pagination.Item>
								{#if item.type === "ellipsis"}
									<Pagination.Ellipsis />
								{:else}
									<Pagination.Link page={item} isActive={item.value === paginationPage} />
								{/if}
							</Pagination.Item>
						{/each}

						<Pagination.Item>
							<Pagination.Next />
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		{/if}
	</div>
{/if}
