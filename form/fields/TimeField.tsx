import { useFieldContext } from "@/form";
import type { TimeValue } from "@/types/TimeValue";
import { Button } from "@heroui/button";
import { TimeInput, type TimeInputProps } from "@heroui/date-input";
import { cn } from "@heroui/react";
import { Time } from "@internationalized/date";
import { IconClockHour1 } from "@tabler/icons-react";
import { useCallback } from "react";

export interface TimeFieldProps
	extends Pick<TimeInputProps, "className" | "label" | "isRequired"> {
	fillable?: boolean;
	fillValue?: TimeValue;
}

export function TimeField({
	className,
	fillable,
	fillValue,
	...props
}: TimeFieldProps) {
	const {
		name,
		state: {
			value,
			meta: { errors },
		},
		handleChange,
		handleBlur,
	} = useFieldContext<TimeValue | null>();

	const onChange = useCallback(
		(time: Time | null) => {
			handleChange(
				time && ({ hour: time.hour, minute: time.minute } satisfies TimeValue),
			);
		},
		[handleChange],
	);

	const onFill = useCallback(() => {
		if (!fillValue) return;

		handleChange(fillValue);
	}, [fillValue, handleChange]);

	const timeValue = value && new Time(value.hour, value.minute);

	return (
		<div className={cn("flex gap-1", className)}>
			<TimeInput<Time>
				name={name}
				value={timeValue}
				onChange={onChange}
				onBlur={handleBlur}
				isInvalid={!!errors.length}
				errorMessage={errors.join(", ")}
				hourCycle={24}
				{...props}
			/>
			{fillable && (
				<Button
					className="h-full"
					isIconOnly
					size="sm"
					variant="bordered"
					onPress={onFill}
					isDisabled={!fillValue}
				>
					<IconClockHour1 size={20} />
				</Button>
			)}
		</div>
	);
}
