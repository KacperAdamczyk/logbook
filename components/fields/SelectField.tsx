import { useFieldContext } from "@/form";
import {
	Autocomplete,
	AutocompleteItem,
	type AutocompleteProps,
} from "@heroui/autocomplete";
import { useCallback } from "react";

export interface SelectFieldItem {
	label: string;
	value: string;
}

interface SelectFieldProps
	extends Pick<
		AutocompleteProps,
		"className" | "label" | "isRequired" | "isDisabled"
	> {
	items: SelectFieldItem[];
}

export function SelectField({ items, ...props }: SelectFieldProps) {
	const {
		name,
		state: {
			value,
			meta: { errors },
		},
		handleChange,
		handleBlur,
	} = useFieldContext<string | null>();

	const onSelectionChange = useCallback<
		NonNullable<AutocompleteProps["onSelectionChange"]>
	>(
		(value) => {
			handleChange(value ? value.toString() : null);
		},
		[handleChange],
	);

	const currentItem = items.find((item) => item.value === value);
	const selectedKey = currentItem?.value ?? null;

	return (
		<Autocomplete
			name={name}
			inputValue={value ?? ""}
			selectedKey={selectedKey}
			onInputChange={handleChange}
			onSelectionChange={onSelectionChange}
			onBlur={handleBlur}
			isInvalid={!!errors.length}
			errorMessage={errors.join(", ")}
			items={items}
			allowsCustomValue
			isClearable
			{...props}
		>
			{(item) => (
				<AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
