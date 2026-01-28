<script lang="ts">
	import { Spinner } from "$lib/components/ui/spinner";
	import Button from "$lib/components/ui/button/button.svelte";
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<svelte:boundary>
	{#snippet pending()}
		<div class="flex h-full items-center justify-center"><Spinner class="size-32" /></div>
	{/snippet}
	{#snippet failed(error, reset)}
		<div class="flex h-full items-center justify-center px-4">
			<div
				class="w-full max-w-xl rounded-2xl border border-destructive/30 bg-background/80 p-6 text-foreground shadow-lg"
			>
				<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div class="space-y-2">
						<p class="text-sm font-medium text-destructive">Something went wrong</p>
						<p class="text-sm text-balance text-muted-foreground">
							We hit an unexpected error while loading this page.
						</p>
						<p class="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive/90">
							{error}
						</p>
					</div>
					<div class="flex items-center gap-2">
						<Button onclick={reset}>Try again</Button>
					</div>
				</div>
			</div>
		</div>
	{/snippet}
	{@render children?.()}
</svelte:boundary>
