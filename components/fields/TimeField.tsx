import { BaseFieldValues, FieldBaseProps } from "@/components/fields/FieldBase";
import { parseTime } from "@internationalized/date";
import { TimeInput, TimeInputProps } from "@nextui-org/react";
import { useCallback } from "react";
import { useController } from "react-hook-form";

interface TimeField<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string>,
		Pick<TimeInputProps, "label"> {}

export function TimeField<FieldValues extends BaseFieldValues>({
	name,
	...timeInputProps
}: TimeField<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues>({ name });

	const onChange = useCallback<NonNullable<TimeInputProps["onChange"]>>(
		(value) => {
			field.onChange(value ? value.toString() : undefined);
		},
		[field],
	);
	const value = field.value ? parseTime(field.value) : null;

	return (
		<TimeInput
			name={field.name}
			inputRef={field.ref}
			value={value}
			onChange={onChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			hourCycle={24}
			{...timeInputProps}
		/>
	);
}
