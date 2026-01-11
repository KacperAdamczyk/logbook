<script lang="ts">
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import ClockIcon from "@lucide/svelte/icons/clock-arrow-up";
	import AlarmClockOffIcon from "@lucide/svelte/icons/alarm-clock-off";
	import { REGEXP_ONLY_DIGITS } from "bits-ui";
	import { joinDuration } from "$lib/utils/join-duration";
	import { Temporal } from "@js-temporal/polyfill";

	interface Props {
		id: string;
		name: string;
		value: string | number;
		readonly?: boolean;
		disabled?: boolean;
		clearable?: boolean;
		fillable?: Temporal.Duration | null;
	}

	let { id, name, value = $bindable(), clearable, fillable, disabled, readonly }: Props = $props();
	const actionsAvailable = $derived(!disabled && !readonly);
</script>

<ButtonGroup.Root class="rounded-md bg-accent">
	{#if clearable}
		<Button
			variant="secondary"
			size="icon"
			aria-label="Fill in zero time"
			onclick={() => {
				value = "0000";
			}}
			disabled={!actionsAvailable}
		>
			<AlarmClockOffIcon />
		</Button>
	{/if}
	<InputOTP.Root
		{id}
		maxlength={4}
		{name}
		pattern={REGEXP_ONLY_DIGITS}
		bind:value={() => value.toString(), (v) => (value = v)}
		{disabled}
		{readonly}
	>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
	{#if fillable !== undefined}
		<Button
			variant="secondary"
			size="icon"
			aria-label="Fill in total time"
			disabled={fillable === null || !actionsAvailable}
			onclick={() => {
				if (!fillable) return;

				value = joinDuration(fillable);
			}}
		>
			<ClockIcon />
		</Button>
	{/if}
</ButtonGroup.Root>
