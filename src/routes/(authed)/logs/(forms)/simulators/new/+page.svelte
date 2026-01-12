<script lang="ts">
	import { SimulatorLogForm } from "$lib/components/simulator-log-form";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription,
		CardFooter,
	} from "$lib/components/ui/card";
	import { createSimulatorLog } from "$lib/remotes/simulator-log/create-simulator-log/create-simulator-log.remote";
</script>

<form {...createSimulatorLog}>
	<Card class="mx-auto w-full max-w-3xl">
		<CardHeader>
			<CardTitle>New Simulator Log</CardTitle>
			<CardDescription>Fill out the form below to create a new simulator log entry.</CardDescription
			>
		</CardHeader>
		<CardContent>
			<SimulatorLogForm remote={createSimulatorLog} />
		</CardContent>
		<CardFooter>
			<Button type="submit" disabled={!!createSimulatorLog.pending}>Add</Button>
		</CardFooter>
	</Card>
</form>
