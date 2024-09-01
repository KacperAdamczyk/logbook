"use client";

import { Button, ButtonGroup, type ButtonGroupProps } from "@nextui-org/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import type { FC } from "react";

export interface DropdownLink {
	text: string;
	href: string;
}

export interface LinkDropdownProps extends ButtonGroupProps {
	mainButtonText: string;
	mainButtonHref: string;
	dropdownLinks: DropdownLink[];
}

export const LinkDropdown: FC<LinkDropdownProps> = ({
	mainButtonText,
	mainButtonHref,
	dropdownLinks,
	...buttonGroupProps
}) => {
	return (
		<ButtonGroup {...buttonGroupProps}>
			<Button as={Link} href={mainButtonHref}>
				{mainButtonText}
			</Button>
			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Button isIconOnly>
						<IconChevronDown />
					</Button>
				</DropdownTrigger>
				<DropdownMenu disallowEmptySelection selectionMode="single">
					{dropdownLinks.map((link) => (
						<DropdownItem key={link.text} color={buttonGroupProps.color}>
							<Link href={link.href}>{link.text}</Link>
						</DropdownItem>
					))}
				</DropdownMenu>
			</Dropdown>
		</ButtonGroup>
	);
};
