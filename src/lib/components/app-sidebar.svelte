<script lang="ts" module>
	import type { Pathname } from "$app/types";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import ChartBarIcon from "@lucide/svelte/icons/chart-bar";
	import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
	import LayoutDashboardIcon from "@lucide/svelte/icons/layout-dashboard";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import PlaneIcon from "@lucide/svelte/icons/plane";
	import UsersIcon from "@lucide/svelte/icons/users";

	const data = {
		navMain: [
			{
				title: "Dashboard",
				url: "/" as const satisfies Pathname,
				icon: LayoutDashboardIcon,
			},
			{
				title: "Logs",
				url: "/logs" as const satisfies Pathname,
				icon: BookOpenIcon,
			},
			{
				title: "Places",
				url: "/places" as const satisfies Pathname,
				icon: MapPinIcon,
			},
			{
				title: "Pilots",
				url: "/pilots" as const satisfies Pathname,
				icon: UsersIcon,
			},
			{
				title: "Aircraft",
				url: "/aircraft" as const satisfies Pathname,
				icon: PlaneIcon,
			},
			{
				title: "Statistics",
				url: "/statistics" as const satisfies Pathname,
				icon: ChartBarIcon,
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import ModeSelector from "$lib/components/mode-selector.svelte";
	import type { ComponentProps } from "svelte";
	import type { User } from "$lib/auth";

	const {
		ref = $bindable(null),
		collapsible = "icon",
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: User } = $props();
</script>

<Sidebar.Root {collapsible} bind:ref {...restProps}>
	<Sidebar.Header>
		<div class="flex items-center justify-between gap-2 font-medium">
			<div
				class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground"
			>
				<GalleryVerticalEndIcon class="size-4" />
			</div>
			<div class="justify-self-start">Logbook</div>
			<ModeSelector />
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
