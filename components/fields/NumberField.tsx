import { BaseFieldValues, FieldBaseProps } from "@/components/fields/FieldBase";
import { Input, InputProps } from "@nextui-org/react";
import { useController } from "react-hook-form";

interface NumberFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string>,
		Pick<InputProps, "className" | "label" | "isRequired"> {}

export function NumberField<FieldValues extends BaseFieldValues>({
	name,
	...inputProps
}: NumberFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues, typeof name>({ name });

	const handleChange = (value: string) => {
		field.onChange(value);
	};

	return (
		<Input
			type="number"
			name={field.name}
			ref={field.ref}
			value={field.value}
			onValueChange={handleChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			{...inputProps}
		/>
	);
}
