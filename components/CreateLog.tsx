import { createLogAction } from "@/actions/createLog";
import { LogForm, LogFormProps } from "@/components/forms/LogForm";
import { today } from "@internationalized/date";
import { FC } from "react";

const defaultValues = {
	date: today("utc").toString(),
	engineType: "single",
} satisfies LogFormProps["defaultValues"];

export const CreateLog: FC = () => {
	return (
		<LogForm
			defaultValues={defaultValues}
			header="Create New Log"
			submitLabel="Create Log"
			action={createLogAction}
			onSuccessToast="Log created successfully"
			onSuccessRedirect="/"
		/>
	);
};
