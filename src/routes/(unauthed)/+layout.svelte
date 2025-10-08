<script lang="ts">

	let { children } = $props();
</script>
<main>
	<h1 class="text-5xl">Logbook</h1>
	{@render children?.()}
</main>
