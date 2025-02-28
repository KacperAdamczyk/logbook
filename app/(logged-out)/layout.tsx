import type { ReactNode } from "react";

export default function LoggedOutLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return <main className="max-w-7xl mx-auto p-2">{children}</main>;
}
