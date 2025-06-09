import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regístrate",
  description: "Nuvora Chat | Regístrate"
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </>
  );
}
