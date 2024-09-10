"use client";

import { Button } from "@nextui-org/button";
import { IconResize } from "@tabler/icons-react";

export const ReloadButton = () => (
    <Button isIconOnly onPress={() => location.reload()}>
        <IconResize />
    </Button>
)