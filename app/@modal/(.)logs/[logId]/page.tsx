import { InterceptModal } from "@/components/InterceptModal";
import { LogDetails } from "@/components/LogDetails";
import { Spinner } from "@nextui-org/spinner";
import { Suspense } from "react";

interface Props {
	params: {
		logId: string;
	};
}

export default function LogPage({ params: { logId } }: Props) {
	return (
		<InterceptModal size="5xl">
			<section>
				<h1 className="text-xl text-center mb-2">Log</h1>
				<Suspense
					fallback={
						<div className="flex justify-center py-4">
							<Spinner />
						</div>
					}
				>
					<LogDetails logId={logId} />
				</Suspense>
			</section>
		</InterceptModal>
	);
}
