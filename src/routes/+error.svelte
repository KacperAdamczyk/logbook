<script lang="ts">
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";

	$inspect(page.error);
</script>

<div class="flex min-h-svh items-center justify-center">
	<Card class="mx-auto w-full max-w-md">
		<CardHeader>
			<CardTitle class="text-destructive">Error {page.status}</CardTitle>
			<CardDescription>Something went wrong</CardDescription>
		</CardHeader>
		<CardContent>
			<p class="text-muted-foreground">{page.error?.message}</p>
		</CardContent>
		<CardFooter>
			<Button href="/">Go Home</Button>
		</CardFooter>
	</Card>
</div>
