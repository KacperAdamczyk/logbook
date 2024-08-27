import type {
	FieldValues as BaseFieldValues,
	FieldPathByValue,
} from "react-hook-form";

export interface FieldBaseProps<FieldValues extends BaseFieldValues, Value> {
	name: FieldPathByValue<FieldValues, Value>;
}

export { BaseFieldValues };
