import { InterceptModal } from "@/components/InterceptModal";
import { LogDetails } from "@/components/LogDetails";
import { ReloadButton } from "@/components/ReloadButton";
import { Spinner } from "@nextui-org/spinner";
import { Suspense } from "react";

interface Props {
	params: Promise<{
		logId: string;
	}>;
}

export default async function LogPage(props: Props) {
	const params = await props.params;

	const { logId } = params;

	return (
		<InterceptModal size="5xl">
			<section className="flex flex-col gap-2 m-4">
				<div className="flex justify-center items-center">
					<h1 className="text-xl text-center grow">Log</h1>
					<ReloadButton />
				</div>
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
