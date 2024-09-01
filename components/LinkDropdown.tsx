"use client";

import { IconChevronDown } from "@tabler/icons-react";
import type { FC } from "react";
import { Button, ButtonGroup, type ButtonGroupProps } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Link } from "@nextui-org/link";

export interface DropdownLink {
    text: string;
    href: string;
}

export interface LinkDropdownProps extends ButtonGroupProps {
    mainButtonText: string;
    mainButtonHref: string;
    dropdownLinks: DropdownLink[];
}

export const LinkDropdown: FC<LinkDropdownProps> = ({ mainButtonText, mainButtonHref, dropdownLinks, ...buttonGroupProps }) => {

    return (
        <ButtonGroup {...buttonGroupProps}>
            <Button as={Link} href={mainButtonHref}>{mainButtonText}</Button>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Button isIconOnly>
                        <IconChevronDown />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    selectionMode="single"
                >
                    {
                        dropdownLinks.map((link) => (
                            <DropdownItem key={link.text} href={link.href} color={buttonGroupProps.color}>
                                {link.text}
                            </DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </Dropdown>
        </ButtonGroup>
    );
}