<script lang="ts">
	import ModeSelector from '$lib/components/mode-selector.svelte';

	const { children } = $props();
</script>

<div class="flex justify-end p-1">
	<ModeSelector />
</div>
{@render children?.()}
