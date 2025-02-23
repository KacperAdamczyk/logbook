import { cn } from "@nextui-org/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Logbook",
	description: "App that stores your logs",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={cn("min-h-screen bg-background", inter.className)}>
				{children}
				<Toaster position="top-center" richColors expand />
			</body>
		</html>
	);
}
