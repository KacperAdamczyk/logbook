<script lang="ts">
	import { page } from "$app/state";
	import AppBoundary from "$lib/components/app-boundary.svelte";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import {
		Breadcrumb,
		BreadcrumbList,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbSeparator,
		BreadcrumbPage,
	} from "$lib/components/ui/breadcrumb";
	import { Separator } from "$lib/components/ui/separator";
	import { SidebarProvider, SidebarInset, SidebarTrigger } from "$lib/components/ui/sidebar";
	import { getUser } from "$lib/remotes/auth/auth.remote";
	import type { LayoutProps } from "./$types";

	const { children }: LayoutProps = $props();
	const { user } = await getUser();

	const BREADCRUMB_LABELS: Record<string, string> = {
		logs: "Logs",
		flights: "Flights",
		simulators: "Simulators",
		statistics: "Statistics",
		aircraft: "Aircraft",
		pilots: "Pilots",
		places: "Places",
		new: "New",
	};

	function formatSegmentLabel(segment: string): string {
		const decoded = decodeURIComponent(segment);
		const knownLabel = BREADCRUMB_LABELS[decoded];

		if (knownLabel) {
			return knownLabel;
		}

		// Avoid exposing opaque IDs in the UI for detail routes.
		if (decoded.length >= 8) {
			return "Details";
		}

		return decoded.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
	}

	const breadcrumbItems = $derived.by(() => {
		const segments = page.url.pathname.split("/").filter(Boolean);

		if (segments.length === 0) {
			return [{ label: "Dashboard", href: "/", isCurrent: true }];
		}

		return [
			{ label: "Dashboard", href: "/", isCurrent: false },
			...segments.map((segment, index) => {
				const href = `/${segments.slice(0, index + 1).join("/")}`;

				return {
					label: formatSegmentLabel(segment),
					href,
					isCurrent: index === segments.length - 1,
				};
			}),
		];
	});
</script>

<SidebarProvider>
	<AppSidebar {user} />
	<SidebarInset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<SidebarTrigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						{#each breadcrumbItems as item, index (item.href)}
							{#if index > 0}
								<BreadcrumbSeparator class={index === 1 ? "hidden md:block" : undefined} />
							{/if}
							<BreadcrumbItem class={index === 0 ? "hidden md:block" : undefined}>
								{#if item.isCurrent}
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								{:else}
									<BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
								{/if}
							</BreadcrumbItem>
						{/each}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
		<AppBoundary>
			{@render children?.()}
		</AppBoundary>
	</SidebarInset>
</SidebarProvider>
