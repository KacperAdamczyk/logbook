import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/FieldBase";
import {
	Autocomplete,
	AutocompleteItem,
	type AutocompleteProps,
} from "@nextui-org/react";
import { useCallback } from "react";
import { useController } from "react-hook-form";

export interface SelectFieldItem {
	label: string;
	value: string;
	key?: string;
}

interface SelectFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string | undefined>,
		Pick<
			AutocompleteProps,
			"className" | "label" | "isRequired" | "isDisabled"
		> {
	items: SelectFieldItem[];
}

export function SelectField<FieldValues extends BaseFieldValues>({
	name,
	items,
	...autocompleteProps
}: SelectFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues>({ name });

	const onChange = useCallback<NonNullable<AutocompleteProps["onInputChange"]>>(
		(value) => {
			field.onChange(value === "" ? undefined : value);
		},
		[field],
	);

	return (
		<Autocomplete
			name={field.name}
			ref={field.ref}
			value={field.value}
			onInputChange={onChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			items={items}
			allowsCustomValue
			{...autocompleteProps}
		>
			{(item) => (
				<AutocompleteItem key={item.key ?? item.value}>
					{item.label}
				</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
