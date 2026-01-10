<script lang="ts">
	import * as InputOTP from "$lib/components/ui/input-otp/index.js";
	import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import ClockIcon from "@lucide/svelte/icons/clock-arrow-up";
	import { REGEXP_ONLY_DIGITS } from "bits-ui";
	import { joinDuration } from "$lib/utils/join-duration";
	import { Temporal } from "@js-temporal/polyfill";

	interface Props {
		id: string;
		name: string;
		value: string | number;
		readonly?: boolean;
		disabled?: boolean;
		fill?: Temporal.Duration | null;
	}

	let { id, name, value = $bindable(), fill, ...rest }: Props = $props();
</script>

<ButtonGroup.Root class="rounded-md bg-accent">
	<InputOTP.Root
		{id}
		maxlength={4}
		{name}
		pattern={REGEXP_ONLY_DIGITS}
		bind:value={() => value.toString(), (v) => (value = v)}
		{...rest}
	>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
	{#if fill !== undefined}
		<Button
			variant="secondary"
			size="icon"
			aria-label="Fill in total time"
			disabled={fill === null}
			onclick={() => {
				if (!fill) return;

				value = joinDuration(fill);
			}}
		>
			<ClockIcon />
		</Button>
	{/if}
</ButtonGroup.Root>
