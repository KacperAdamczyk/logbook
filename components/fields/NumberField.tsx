import { BaseFieldValues, FieldBaseProps } from "@/components/fields/FieldBase";
import { Input, InputProps } from "@nextui-org/react";
import { useController } from "react-hook-form";

interface NumberFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, number | undefined>,
		Pick<InputProps, "className" | "label" | "isRequired"> {}

export function NumberField<FieldValues extends BaseFieldValues>({
	name,
	...inputProps
}: NumberFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues>({ name });

	const handleChange = (value: string) => {
		const numberValue = value === "" ? undefined : Number(value);
		field.onChange(numberValue);
	};

    const value = field.value?.toString() ?? "";

	return (
		<Input
			type="number"
			name={field.name}
			ref={field.ref}
			value={value}
			onValueChange={handleChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			{...inputProps}
		/>
	);
}