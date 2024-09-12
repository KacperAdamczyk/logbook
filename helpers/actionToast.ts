import { toast } from "sonner";

interface ActionToastParams<Data> {
	successMessageFn: (data?: Data) => string | undefined;
}

interface OnSuccessFn<Data> {
	(data: { data?: Data }): void;
}

interface OnErrorFn {
	(input: {
		error: {
			serverError?: string;
			validationErrors?: { _errors?: string[] };
		};
	}): void;
}

export const actionToast = <Data>({
	successMessageFn,
}: ActionToastParams<Data>) => {
	const onSuccess: OnSuccessFn<Data> = ({ data }) => {
		const message = successMessageFn(data);

		if (message) {
			toast.success(message);
		}
	};

	const onError: OnErrorFn = ({ error: { serverError, validationErrors } }) => {
		if (serverError) {
			toast.error(serverError);
		}

		validationErrors?._errors?.forEach((error) => {
			toast.error(error);
		});
	};

	return { onSuccess, onError };
};
