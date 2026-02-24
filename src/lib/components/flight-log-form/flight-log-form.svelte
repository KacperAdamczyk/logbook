<script lang="ts">
	import type { RemoteForm } from "@sveltejs/kit";

	import type { FlightLogSchemaInput } from "$lib/remotes/flight-log/flight-log.schema";
	import * as Field from "$lib/components/ui/field";
	import { FieldWrapper } from "$lib/components/field-wrapper";
	import { DatePicker } from "$lib/components/date-picker";
	import Input from "$lib/components/ui/input/input.svelte";
	import TimeInput from "$lib/components/time-input/time-input.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	import { timeDifference } from "$lib/utils/time-difference";
	import { parseTime } from "$lib/utils/parse-time";
	import { joinDuration } from "$lib/utils/join-duration";
	import { getAllPlaces } from "$lib/remotes/places/get-all-places/get-all-places.remote";
	import { CreatableCombobox } from "$lib/components/creatable-combobox";
	import { getAllAircraft } from "$lib/remotes/aircraft/get-all-aircraft/get-all-aircraft.remote";
	import { getAllPilots } from "$lib/remotes/pilots/get-all-pilots/get-all-pilots.remote";

	interface Props {
		remote: RemoteForm<FlightLogSchemaInput, void>;
	}

	const { remote }: Props = $props();

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

	let selectedTab = $state("single-pilot-single-engine");

	const places = await getAllPlaces();
	const aircraft = await getAllAircraft();
	const pilots = await getAllPilots();

	const placeItems = places.map(({ name }) => ({
		value: name,
		label: name,
	}));
	const pilotItems = pilots.map(({ name }) => ({
		value: name,
		label: name,
	}));
	const aircraftModelItems = Array.from(new Set(aircraft.map(({ model }) => model))).map(
		(model) => ({
			value: model,
			label: model,
		}),
	);
	const aircraftRegistrationItems = $derived.by(() => {
		const selectedModel = remote.fields.aircraftModel.value();

		if (selectedModel) {
			return aircraft
				.filter(({ model }) => model === selectedModel)
				.map(({ registration }) => ({
					value: registration,
					label: registration,
				}));
		}
		return [];
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
					<CreatableCombobox
						{id}
						{...remote.fields.departurePlace.as("text")}
						placeholder="ICAO"
						maxVisibleItems={50}
						items={placeItems}
					/>
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Departure Time" errors={remote.fields.departureTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.departureTime.as("text")} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Arrival Place" errors={remote.fields.arrivalPlace.issues()}>
				{#snippet children(id)}
					<CreatableCombobox
						{id}
						{...remote.fields.arrivalPlace.as("text")}
						placeholder="ICAO"
						maxVisibleItems={50}
						items={placeItems}
					/>
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
					<CreatableCombobox
						{id}
						{...remote.fields.aircraftModel.as("text")}
						placeholder="Model"
						maxVisibleItems={50}
						items={aircraftModelItems}
					/>
				{/snippet}
			</FieldWrapper>
			<FieldWrapper
				label="Aircraft Registration"
				errors={remote.fields.aircraftRegistration.issues()}
			>
				{#snippet children(id)}
					<CreatableCombobox
						{id}
						{...remote.fields.aircraftRegistration.as("text")}
						placeholder="Registration"
						maxVisibleItems={50}
						items={aircraftRegistrationItems}
					/>
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Pilot in Command -->
		<Field.Group>
			<FieldWrapper label="Pilot in Command" errors={remote.fields.pilotInCommandName.issues()}>
				{#snippet children(id)}
					<CreatableCombobox
						{id}
						{...remote.fields.pilotInCommandName.as("text")}
						placeholder="Select or enter pilot name"
						maxVisibleItems={50}
						items={pilotItems}
					/>
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Total Flight Time: Centered -->
		<Field.Group class="mx-auto w-full max-w-xs">
			<FieldWrapper label="Total Flight Time" errors={remote.fields.totalFlightTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.totalFlightTime.as("text")} readonly />
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Aircraft Configuration Times: Tabs for SP SE / SP ME / MP -->
		<Field.Group>
			<Tabs.Root class="w-full" bind:value={selectedTab}>
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="single-pilot-single-engine">SP SE</Tabs.Trigger>
					<Tabs.Trigger value="single-pilot-multi-engine">SP ME</Tabs.Trigger>
					<Tabs.Trigger value="multi-pilot">MP</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="single-pilot-single-engine" class="mt-4">
					<FieldWrapper
						label="Single Pilot Single Engine Time"
						errors={remote.fields.singlePilotSingleEngineTime.issues()}
					>
						{#snippet children(id)}
							<TimeInput
								{id}
								clearable
								fillable={totalTime}
								{...remote.fields.singlePilotSingleEngineTime.as("text")}
							/>
						{/snippet}
					</FieldWrapper>
				</Tabs.Content>
				<Tabs.Content value="single-pilot-multi-engine" class="mt-4">
					<FieldWrapper
						label="Single Pilot Multi Engine Time"
						errors={remote.fields.singlePilotMultiEngineTime.issues()}
					>
						{#snippet children(id)}
							<TimeInput
								{id}
								clearable
								fillable={totalTime}
								{...remote.fields.singlePilotMultiEngineTime.as("text")}
							/>
						{/snippet}
					</FieldWrapper>
				</Tabs.Content>
				<Tabs.Content value="multi-pilot" class="mt-4">
					<FieldWrapper label="Multi Pilot Time" errors={remote.fields.multiPilotTime.issues()}>
						{#snippet children(id)}
							<TimeInput
								{id}
								clearable
								fillable={totalTime}
								{...remote.fields.multiPilotTime.as("text")}
							/>
						{/snippet}
					</FieldWrapper>
				</Tabs.Content>
			</Tabs.Root>
		</Field.Group>

		<!-- Operational Conditions: Night and IFR in same row -->
		<Field.Group class="grid grid-cols-1 md:grid-cols-2">
			<FieldWrapper
				label="Night Time"
				errors={remote.fields.operationalConditionNightTime.issues()}
			>
				{#snippet children(id)}
					<TimeInput
						{id}
						clearable
						fillable={totalTime}
						{...remote.fields.operationalConditionNightTime.as("text")}
					/>
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="IFR Time" errors={remote.fields.operationalConditionIfrTime.issues()}>
				{#snippet children(id)}
					<TimeInput
						clearable
						fillable={totalTime}
						{id}
						{...remote.fields.operationalConditionIfrTime.as("text")}
					/>
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Function Times: 2x2 grid -->
		<Field.Group class="grid grid-cols-1 md:grid-cols-2">
			<FieldWrapper label="PIC Time" errors={remote.fields.functionPilotInCommandTime.issues()}>
				{#snippet children(id)}
					<TimeInput
						{id}
						clearable
						fillable={totalTime}
						{...remote.fields.functionPilotInCommandTime.as("text")}
					/>
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Co-Pilot Time" errors={remote.fields.functionCoPilotTime.issues()}>
				{#snippet children(id)}
					<TimeInput
						{id}
						clearable
						fillable={totalTime}
						{...remote.fields.functionCoPilotTime.as("text")}
					/>
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Dual Time" errors={remote.fields.functionDualTime.issues()}>
				{#snippet children(id)}
					<TimeInput
						{id}
						clearable
						fillable={totalTime}
						{...remote.fields.functionDualTime.as("text")}
					/>
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Instructor Time" errors={remote.fields.functionInstructorTime.issues()}>
				{#snippet children(id)}
					<TimeInput
						{id}
						clearable
						fillable={totalTime}
						{...remote.fields.functionInstructorTime.as("text")}
					/>
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
	<Field.Error errors={remote.fields.issues()} />
</Field.Set>
