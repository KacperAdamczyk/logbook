<script lang="ts">
	import ModeSelector from "$lib/components/mode-selector.svelte";
	import type { LayoutProps } from "./$types";

	const { children }: LayoutProps = $props();
</script>

<div class="flex justify-end p-1">
	<ModeSelector />
</div>
{@render children?.()}
