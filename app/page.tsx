import { auth } from "@/auth";

export default async function Home() {
	const session = await auth();

	return (
		<main>
			<h1>hello</h1>
			{session?.user?.email}
		</main>
	);
}
