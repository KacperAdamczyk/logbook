import { Button } from "@heroui/button";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/modal";
import type { FC, PropsWithChildren } from "react";

interface ConfirmationModalProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
}

export const ConfirmationModal: FC<
	PropsWithChildren<ConfirmationModalProps>
> = ({ isOpen, onConfirm, onCancel, confirmText = "Confirm", children }) => {
	return (
		<Modal
			isDismissable={false}
			isOpen={isOpen}
			hideCloseButton
			backdrop="blur"
		>
			<ModalContent>
				<ModalHeader>Confirmation</ModalHeader>
				<ModalBody>{children}</ModalBody>
				<ModalFooter>
					<Button color="primary" variant="light" onPress={onCancel}>
						Close
					</Button>
					<Button color="danger" onPress={onConfirm}>
						{confirmText}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
