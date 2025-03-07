import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/fieldBase";
import { Input, type InputProps } from "@heroui/input";
import { useController } from "react-hook-form";

interface InputFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string | undefined>,
		Pick<InputProps, "className" | "label" | "isRequired" | "type"> {}

export function InputField<FieldValues extends BaseFieldValues>({
	name,
	...inputProps
}: InputFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues, typeof name>({ name });

	const value = field.value ?? "";

	return (
		<Input
			name={field.name}
			ref={field.ref}
			value={value}
			onValueChange={field.onChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			{...inputProps}
		/>
	);
}
