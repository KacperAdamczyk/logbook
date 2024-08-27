import { LogForm, LogFormProps } from "@/components/forms/LogForm";
import { today } from "@internationalized/date";
import { FC } from "react";

const defaultValues = {
	date: today("utc").toString(),
} satisfies LogFormProps["defaultValues"];

export const CreateLog: FC = () => {
	return <LogForm defaultValues={defaultValues} />;
};
