import { UpdateLog } from "@/components/UpdateLog";

interface Props {
	params: Promise<{
		logId: string;
	}>;
}

export default async function UpdateLogPage(props: Props) {
	const params = await props.params;

	const { logId } = params;

	return (
		<section>
			<h1 className="text-xl text-center mb-2">Edit Log</h1>
			<UpdateLog onSuccessRedirect="/" logId={logId} />
		</section>
	);
}
