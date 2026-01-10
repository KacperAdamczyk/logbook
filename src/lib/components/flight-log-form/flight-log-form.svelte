<script lang="ts">
	import type { RemoteForm } from "@sveltejs/kit";

	import {
		flightLogConfigurations,
		type FlightLogSchemaInput,
	} from "$lib/remotes/flight-log/flight-log.schema";
	import * as Field from "$lib/components/ui/field";
	import { FieldWrapper } from "$lib/components/field-wrapper";
	import { DatePicker } from "$lib/components/date-picker";
	import Input from "$lib/components/ui/input/input.svelte";
	import TimeInput from "$lib/components/time-input/time-input.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import Label from "$lib/components/ui/label/label.svelte";
	import z from "zod";
	import { timeDifference } from "$lib/utils/time-difference";
	import { parseTime } from "$lib/utils/parse-time";
	import { joinDuration } from "$lib/utils/join-duration";

	interface Props {
		remote: RemoteForm<FlightLogSchemaInput, unknown>;
	}

	const { remote }: Props = $props();

	$effect(() => {
		// Ensure that singlePilotTime and multiPilotTime are cleared based on configuration
		const configuration = remote.fields.configuration.value();
		if (
			configuration === "single-pilot-single-engine" ||
			configuration === "single-pilot-multi-engine"
		) {
			remote.fields.multiPilotTime.set("");
		} else if (configuration === "multi-pilot") {
			remote.fields.singlePilotTime.set("");
		}
	});

	const totalTime = $derived.by(() => {
		const departureTime = remote.fields.departureTime.value();
		const arrivalTime = remote.fields.arrivalTime.value();

		if (departureTime?.length !== 4 || arrivalTime?.length !== 4) {
			return null;
		}

		return timeDifference(parseTime(departureTime), parseTime(arrivalTime));
	});

	$effect(() => {
		if (totalTime !== null) {
			remote.fields.totalFlightTime.set(joinDuration(totalTime));
		} else {
			remote.fields.totalFlightTime.set("");
		}
	});
</script>

<Field.Set>
	<Field.Legend>Flight Log Entry</Field.Legend>
	<Field.Description>Flight log entry form</Field.Description>
	<Field.Group>
		<!-- Date: Full width -->
		<Field.Group>
			<FieldWrapper label="Date" errors={remote.fields.date.issues()}>
				{#snippet children(id)}
					<DatePicker {id} {...remote.fields.date.as("text")}></DatePicker>
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Departure/Arrival: 2x2 grid on desktop, single column on mobile -->
		<Field.Group class="grid grid-cols-1 md:grid-cols-2">
			<FieldWrapper label="Departure Place" errors={remote.fields.departurePlace.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.departurePlace.as("text")} placeholder="ICAO" />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Departure Time" errors={remote.fields.departureTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.departureTime.as("text")} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Arrival Place" errors={remote.fields.arrivalPlace.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.arrivalPlace.as("text")} placeholder="ICAO" />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Arrival Time" errors={remote.fields.arrivalTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.arrivalTime.as("text")} />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Aircraft: Model and Registration in same row -->
		<Field.Group class="grid grid-cols-1 md:grid-cols-2">
			<FieldWrapper label="Aircraft Model" errors={remote.fields.aircraftModel.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.aircraftModel.as("text")} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper
				label="Aircraft Registration"
				errors={remote.fields.aircraftRegistration.issues()}
			>
				{#snippet children(id)}
					<Input {id} {...remote.fields.aircraftRegistration.as("text")} />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Configuration: Radio on one side, time input on other -->
		{@const configuration = remote.fields.configuration.value()}
		<Field.Group class="grid grid-cols-1 md:grid-cols-[1fr_auto]">
			<FieldWrapper label="Configuration" errors={remote.fields.configuration.issues()}>
				{#snippet children(id)}
					<RadioGroup.Root
						{id}
						value={configuration}
						onValueChange={(value) =>
							remote.fields.configuration.set(z.enum(flightLogConfigurations).parse(value))}
						class="flex flex-col gap-2 md:flex-row md:gap-4"
					>
						<div class="flex items-center gap-2">
							<RadioGroup.Item id="single-pilot-single-engine" value="single-pilot-single-engine" />
							<Label for="single-pilot-single-engine" class="font-normal">SP SE</Label>
						</div>
						<div class="flex items-center gap-2">
							<RadioGroup.Item id="single-pilot-multi-engine" value="single-pilot-multi-engine" />
							<Label for="single-pilot-multi-engine" class="font-normal">SP ME</Label>
						</div>
						<div class="flex items-center gap-2">
							<RadioGroup.Item id="multi-pilot" value="multi-pilot" />
							<Label for="multi-pilot" class="font-normal">MP</Label>
						</div>
					</RadioGroup.Root>
				{/snippet}
			</FieldWrapper>
			{#if configuration === "single-pilot-single-engine" || configuration === "single-pilot-multi-engine"}
				<FieldWrapper label="SP Time" errors={remote.fields.singlePilotTime.issues()}>
					{#snippet children(id)}
						<TimeInput {id} {...remote.fields.singlePilotTime.as("text")} />
					{/snippet}
				</FieldWrapper>
			{:else if configuration === "multi-pilot"}
				<FieldWrapper label="MP Time" errors={remote.fields.multiPilotTime.issues()}>
					{#snippet children(id)}
						<TimeInput {id} {...remote.fields.multiPilotTime.as("text")} />
					{/snippet}
				</FieldWrapper>
			{/if}
		</Field.Group>

		<!-- Pilot in Command -->
		<Field.Group>
			<FieldWrapper label="Pilot in Command" errors={remote.fields.pilotInCommandName.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.pilotInCommandName.as("text")} />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Total Flight Time: Centered -->
		<Field.Group class="mx-auto w-full max-w-xs">
			<FieldWrapper label="Total Flight Time" errors={remote.fields.totalFlightTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.totalFlightTime.as("text")} disabled />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Operational Conditions: Night and IFR in same row -->
		<Field.Group class="grid grid-cols-1 md:grid-cols-2">
			<FieldWrapper
				label="Night Time"
				errors={remote.fields.operationalConditionNightTime.issues()}
			>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.operationalConditionNightTime.as("text")} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="IFR Time" errors={remote.fields.operationalConditionIfrTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.operationalConditionIfrTime.as("text")} />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Function Times: 2x2 grid -->
		<Field.Group class="grid grid-cols-1 md:grid-cols-2">
			<FieldWrapper label="PIC Time" errors={remote.fields.functionPilotInCommandTime.issues()}>
				{#snippet children(id)}
					<TimeInput
						{id}
						{...remote.fields.functionPilotInCommandTime.as("text")}
						fill={totalTime}
					/>
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Co-Pilot Time" errors={remote.fields.functionCoPilotTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.functionCoPilotTime.as("text")} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Dual Time" errors={remote.fields.functionDualTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.functionDualTime.as("text")} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Instructor Time" errors={remote.fields.functionInstructorTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.functionInstructorTime.as("text")} />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Takeoffs & Landings: 2x2 grid -->
		<Field.Group class="grid grid-cols-1 md:grid-cols-2">
			<FieldWrapper label="Takeoffs Day" errors={remote.fields.takeoffsDay.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.takeoffsDay.as("number")} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Takeoffs Night" errors={remote.fields.takeoffsNight.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.takeoffsNight.as("number")} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Landings Day" errors={remote.fields.landingsDay.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.landingsDay.as("number")} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Landings Night" errors={remote.fields.landingsNight.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.landingsNight.as("number")} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Remarks -->
		<Field.Group>
			<FieldWrapper label="Remarks" errors={remote.fields.remarks.issues()}>
				{#snippet children(id)}
					<Textarea {id} {...remote.fields.remarks.as("text")} />
				{/snippet}
			</FieldWrapper>
		</Field.Group>
	</Field.Group>
	<Field.Error errors={remote.fields.allIssues()} />
</Field.Set>
