import { InterceptModal } from "@/components/InterceptModal";
import { LogDetails } from "@/components/LogDetails";
import { ReloadButton } from "@/components/ReloadButton";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { IconResize } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

interface Props {
	params: {
		logId: string;
	};
}

export default function LogPage({ params: { logId } }: Props) {
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
