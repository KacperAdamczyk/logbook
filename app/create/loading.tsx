import { Spinner } from "@nextui-org/react";

export default function Loading() {
    return <div className="flex justify-center items-center h-[calc(100vh-64px)]"><Spinner size="lg" /></div>
}