import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal - The Gravity Studios",
  description: "The Gravity Studios Master Control Portal",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
