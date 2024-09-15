import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/FieldBase";
import { parseDate } from "@internationalized/date";
import { DatePicker, type DatePickerProps } from "@nextui-org/react";
import { useCallback } from "react";
import { useController } from "react-hook-form";

interface DateFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string | undefined>,
		Pick<DatePickerProps, "className" | "label" | "isRequired"> {}

export function DateField<FieldValues extends BaseFieldValues>({
	name,
	...datePickerProps
}: DateFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues>({ name });

	const onChange = useCallback<NonNullable<DatePickerProps["onChange"]>>(
		(value) => {
			field.onChange(value ? value.toString() : undefined);
		},
		[field],
	);
	const value = field.value ? parseDate(field.value) : null;

	return (
		<DatePicker
			name={field.name}
			inputRef={field.ref}
			value={value}
			onChange={onChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			showMonthAndYearPickers
			{...datePickerProps}
		/>
	);
}
