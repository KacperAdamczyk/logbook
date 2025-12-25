<script lang="ts">
	import { FlightLogForm } from "$lib/components/flight-log-form";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
		CardFooter,
	} from "$lib/components/ui/card";
	import { createFlightLog } from "$lib/remotes/flight-log/create-flight-log/create-flight-log.remote";
</script>

<form {...createFlightLog}>
	<Card class="mx-auto w-full max-w-3xl">
		<CardHeader>
			<CardTitle>New Flight Log</CardTitle>
			<CardDescription>Fill out the form below to create a new flight log entry.</CardDescription>
		</CardHeader>
		<CardContent>
			<FlightLogForm remote={createFlightLog} />
		</CardContent>
		<CardFooter>
			<Button type="submit" disabled={!!createFlightLog.pending}>Add</Button>
		</CardFooter>
	</Card>
</form>
