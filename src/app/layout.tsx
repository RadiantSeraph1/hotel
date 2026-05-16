import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury Touch Hotel | Tarkwa",
  description:
    "Luxury Touch Hotel in Tarkwa with rooms, restaurant, lounge, pool, conference facilities, and booking requests.",
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
