import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "RoamFree",
  description: "Your ultimate travel companion for accommodation, transport, and exploration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
