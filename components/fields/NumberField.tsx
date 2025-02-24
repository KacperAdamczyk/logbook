import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/fieldBase";
import { Input, type InputProps } from "@heroui/input";
import { useCallback } from "react";
import { useController } from "react-hook-form";

interface NumberFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, number | null>,
		Pick<InputProps, "className" | "label" | "isRequired"> {}

export function NumberField<FieldValues extends BaseFieldValues>({
	name,
	...inputProps
}: NumberFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues, typeof name>({ name });

	const handleChange = useCallback(
		(value: string) => {
			field.onChange(value !== "" ? Number.parseInt(value) : null);
		},
		[field],
	);

	return (
		<Input
			type="number"
			name={field.name}
			ref={field.ref}
			value={field.value ?? ""}
			onValueChange={handleChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			{...inputProps}
		/>
	);
}
