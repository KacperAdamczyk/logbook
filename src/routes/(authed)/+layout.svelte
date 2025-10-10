<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import {
		Breadcrumb,
		BreadcrumbList,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbSeparator,
		BreadcrumbPage
	} from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';

	const { children } = $props();
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<header
			class="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
		>
			<div class="flex items-center gap-2 px-4">
				<SidebarTrigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem class="hidden md:block">
							<BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator class="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>Data Fetching</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
		{@render children()}
	</SidebarInset>
</SidebarProvider>
