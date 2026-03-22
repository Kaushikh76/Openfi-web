import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Openfi",
  description: "A framework that lets you build impactful agents not skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
