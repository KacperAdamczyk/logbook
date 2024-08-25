import { auth, signOut } from "@/auth";
import {
	Button,
	Link,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	User,
} from "@nextui-org/react";

export async function Navigation() {
	const session = await auth();
	const userName = session?.user?.name ?? undefined;

	return (
		<Navbar maxWidth="xl">
			<NavbarBrand>
				<p className="font-bold text-inherit">Logbook</p>
			</NavbarBrand>
			<NavbarContent justify="center">
				<NavbarItem>
					<Link color="foreground" href="#">
						Logs
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Search
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Aircraft
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Places
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link color="foreground" href="#">
						Places
					</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<User
					name={userName}
					avatarProps={{ name: userName, isBordered: true }}
				/>
				<NavbarItem>
					<form
						action={async () => {
							"use server";
							await signOut();
						}}
					>
						<Button type="submit" color="primary" variant="flat">
							Log Out
						</Button>
					</form>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
}
