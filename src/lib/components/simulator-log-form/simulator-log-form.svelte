<script lang="ts">
	import type { RemoteForm } from "@sveltejs/kit";

	import type { SimulatorLogSchemaInput } from "$lib/remotes/simulator-log/simulator-log.schema";
	import * as Field from "$lib/components/ui/field";
	import { FieldWrapper } from "$lib/components/field-wrapper";
	import { DatePicker } from "$lib/components/date-picker";
	import Input from "$lib/components/ui/input/input.svelte";
	import TimeInput from "$lib/components/time-input/time-input.svelte";
	import Textarea from "$lib/components/ui/textarea/textarea.svelte";

	interface Props {
		remote: RemoteForm<SimulatorLogSchemaInput, void>;
	}

	const { remote }: Props = $props();
</script>

<Field.Set>
	<Field.Legend>Simulator Log Entry</Field.Legend>
	<Field.Description>Simulator log entry form</Field.Description>
	<Field.Group>
		<!-- Date: Full width -->
		<Field.Group>
			<FieldWrapper label="Date" errors={remote.fields.date.issues()}>
				{#snippet children(id)}
					<DatePicker {id} {...remote.fields.date.as("text")}></DatePicker>
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Type -->
		<Field.Group>
			<FieldWrapper label="Simulator Type" errors={remote.fields.type.issues()}>
				{#snippet children(id)}
					<Input
						{id}
						{...remote.fields.type.as("text")}
						placeholder="e.g., Full Flight Simulator"
					/>
				{/snippet}
			</FieldWrapper>
		</Field.Group>

		<!-- Total Time -->
		<Field.Group class="mx-auto w-full max-w-xs">
			<FieldWrapper label="Total Time" errors={remote.fields.totalTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.totalTime.as("text")} />
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
