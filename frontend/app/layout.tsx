import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: {
    default: "ProductIQ",
    template: "%s | ProductIQ",
  },
  description:
    "AI-powered industrial product data enrichment and quality platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <Topbar />

        <div className="min-h-screen pl-[250px] pt-[72px]">
          <main className="mx-auto max-w-[1600px] px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}