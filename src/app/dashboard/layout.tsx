import { Sidebar } from "@/components";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Sesion registrada",
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
    </>
  );
}
