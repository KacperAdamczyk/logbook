import { useCallback, useState } from "react";

export const useConfirmationModal = (onConfirmation: () => void) => {
	const [isOpen, setIsOpen] = useState(false);

	const requestConfirmation = useCallback(() => {
		setIsOpen(true);
	}, []);

	const onConfirm = useCallback(() => {
		setIsOpen(false);
		onConfirmation();
	}, [onConfirmation]);

	const onCancel = useCallback(() => {
		setIsOpen(false);
	}, []);

	return {
		requestConfirmation,
		modal: {
			isOpen,
			onConfirm,
			onCancel,
		},
	};
};
