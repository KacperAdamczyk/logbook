import { BaseFieldValues, FieldBaseProps } from "@/components/fields/FieldBase";
import { DateValue, parseDate } from "@internationalized/date";
import { DatePicker, DatePickerProps } from "@nextui-org/react";
import { useCallback } from "react";
import { useController, useFormContext } from "react-hook-form";

interface DateFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string>,
		Pick<DatePickerProps, "label"> {}

export function DateField<FieldValues extends BaseFieldValues>({
	name,
	...datePickerProps
}: DateFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues>({ name });

	const onChange = useCallback<NonNullable<DatePickerProps["onChange"]>>(
		(value: DateValue) => {
			field.onChange(value.toString());
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
