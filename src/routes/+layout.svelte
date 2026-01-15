<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import AppBoundary from "$lib/components/app-boundary.svelte";
	import type { LayoutProps } from "./$types";

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="h-svh bg-muted px-2">
	<ModeWatcher />
	<Toaster richColors />
	<AppBoundary>
		{@render children?.()}
	</AppBoundary>
</div>
