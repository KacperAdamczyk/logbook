import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalFooter } from "@nextui-org/modal";
import type { FC } from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
}

export const ConfirmationModal: FC<ConfirmationModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
}) => {
    return (
        <Modal isDismissable={false} isOpen={isOpen}>
            <ModalBody></ModalBody>
            <ModalFooter>
                <Button color="primary" variant="light" onPress={onCancel}>
                    Close
                </Button>
                <Button color="danger" onPress={onConfirm}>
                    {confirmText}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
