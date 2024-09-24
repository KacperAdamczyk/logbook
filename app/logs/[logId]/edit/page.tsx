import { UpdateLog } from "@/components/UpdateLog";

interface Props {
	params: {
		logId: string;
	};
}

export default function UpdateLogPage({ params: { logId } }: Props) {
	return (
		<section>
			<h1 className="text-xl text-center mb-2">Edit Log</h1>
			<UpdateLog onSuccessRedirect="/" logId={logId} />
		</section>
	);
}
