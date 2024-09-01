import { CreateLog } from "@/components/CreateLog";
import { InterceptModal } from "@/components/InterceptModal";
import { Spinner } from "@nextui-org/spinner";
import { Suspense } from "react";

export default function CreatePage() {
	return (
		<InterceptModal size="5xl">
			<h1 className="text-xl text-center mb-2">Create New Log</h1>
			<Suspense
				fallback={
					<div className="flex justify-center py-4">
						<Spinner />
					</div>
				}
			>
				<CreateLog />
			</Suspense>
		</InterceptModal>
	);
}
