"use client";

import {
	Modal,
	ModalBody,
	ModalContent,
	type ModalProps,
} from "@nextui-org/modal";

import { useRouter } from "next/navigation";

import { type FC, type PropsWithChildren, useCallback } from "react";

interface Props extends Omit<ModalProps, "onOpenChange" | "isOpen"> { }

export const InterceptModal: FC<PropsWithChildren<Props>> = ({
	children,
	...modalProps
}) => {
	const router = useRouter();
	const onOpenChange = useCallback(() => {
		router.back();
	}, [router]);

	return (
		<Modal isOpen onOpenChange={onOpenChange} {...modalProps}>
			<ModalContent>
				<ModalBody>{children}</ModalBody>
			</ModalContent>
		</Modal>
	);
};
