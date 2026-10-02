import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal - The Gravity Studios",
  description: "The Gravity Studios Private Client Portal",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
