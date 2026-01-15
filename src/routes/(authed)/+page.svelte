<script lang="ts">
	import { getUser } from "$lib/remotes/auth/auth.remote";
	import { Button } from "$lib/components/ui/button";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { resolve } from "$app/paths";
	import AppBoundary from "$lib/components/app-boundary.svelte";
</script>

<AppBoundary>
	{@const { user } = await getUser()}
	<div class="p-6">
		<h1 class="mb-2 text-2xl font-bold">Dashboard</h1>
		<p class="mb-6 text-muted-foreground">Welcome back, {user.name}</p>
		<div class="flex flex-wrap gap-4">
			<Button href={resolve("/logs/flights/new")}>
				<PlusIcon class="mr-2 size-4" />
				Create Flight Log
			</Button>
			<Button href={resolve("/logs/simulators/new")}>
				<PlusIcon class="mr-2 size-4" />
				Create Simulator Log
			</Button>
		</div>
	</div>
</AppBoundary>
