import { Spinner } from "@heroui/spinner";

export default function Loading() {
	return (
		<div className="flex justify-center items-center h-[calc(100vh-64px-16px)]">
			<Spinner size="lg" />
		</div>
	);
}
