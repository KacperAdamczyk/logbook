import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/fieldBase";
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
}

interface SelectFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string | null>,
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
	} = useController<FieldValues, typeof name>({ name });

	const onInputChange = useCallback<
		NonNullable<AutocompleteProps["onInputChange"]>
	>(
		(value) => {
			field.onChange(value);
		},
		[field],
	);

	const onSelectionChange = useCallback<
		NonNullable<AutocompleteProps["onSelectionChange"]>
	>(
		(value) => {
			field.onChange(value);
		},
		[field],
	);

	const currentItem = items.find((item) => item.value === field.value);
	const selectedKey = currentItem?.value ?? null;

	return (
		<Autocomplete
			name={field.name}
			wrapperRef={field.ref}
			inputValue={field.value ?? ""}
			selectedKey={selectedKey}
			onInputChange={onInputChange}
			onSelectionChange={onSelectionChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			items={items}
			allowsCustomValue
			isClearable
			{...autocompleteProps}
		>
			{(item) => (
				<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
