import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/FieldBase";
import type { EngineType } from "@/components/forms/LogForm";
import { Radio, RadioGroup, type RadioGroupProps } from "@nextui-org/react";
import { useController } from "react-hook-form";

export interface RadioFieldOption {
	label: string;
	value: string;
}

interface RadioFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, EngineType>,
		Pick<
			RadioGroupProps,
			"className" | "label" | "isRequired" | "orientation"
		> {
	options: RadioFieldOption[];
}

export function RadioField<FieldValues extends BaseFieldValues>({
	name,
	options,
	...radioGroupProps
}: RadioFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues>({ name });

	return (
		<RadioGroup
			name={field.name}
			ref={field.ref}
			value={field.value}
			onValueChange={field.onChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			{...radioGroupProps}
		>
			{options.map(({ label, value }) => (
				<Radio key={value} value={value}>
					{label}
				</Radio>
			))}
		</RadioGroup>
	);
}
