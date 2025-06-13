import { Sidebar } from "@/components";

import type { Metadata } from "next";
import { Toaster } from "sonner";
export const metadata: Metadata = {
  title: "Nuvora Chat",
  description: "Nuvora Chat | Conversaciones en Tiempo Real",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </>
  );
}
