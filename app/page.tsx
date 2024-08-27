import { Button, Link } from "@nextui-org/react";

export default function Home() {
	return (
		<section>
			<Button as={Link} href="/create">
				New +
			</Button>
		</section>
	);
}
