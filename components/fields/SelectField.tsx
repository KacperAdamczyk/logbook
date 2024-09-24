import { BaseFieldValues, FieldBaseProps } from "@/components/fields/FieldBase";
import {
	Autocomplete,
	AutocompleteItem,
	AutocompleteProps,
} from "@nextui-org/react";
import { useCallback } from "react";
import { useController } from "react-hook-form";

export interface SelectFieldItem {
	label: string;
	value: string;
	key: string;
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
		(key) => {
			const value = items.find((item) => item.key === key)?.value;

			field.onChange(value);
		},
		[field, items],
	);

	const currentItem = items.find((item) => item.value === field.value);
	const selectedKey = currentItem?.key ?? null;

	return (
		<Autocomplete
			name={field.name}
			// wrapperRef={field.ref}
			inputValue={field.value ?? ""}
			selectedKey={selectedKey}
			// onInputChange={onInputChange}
			onSelectionChange={onSelectionChange}
			// onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			items={items}
			allowsCustomValue
			isClearable
			{...autocompleteProps}
		>
			{(item) => (
				<AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
