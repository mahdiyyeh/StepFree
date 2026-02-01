import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Step Free - Accessibility Journey Planner",
  description: "Plan accessible journeys with confidence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
