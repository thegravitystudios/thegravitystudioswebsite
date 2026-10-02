"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ClientPortalRootPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAuthRedirect() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/portal/login");
        return;
      }

      // Query user role from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      const userRole = profile?.role || "client";

      if (userRole === "admin" || userRole === "team") {
        router.replace("/portal/admin/dashboard");
      } else {
        router.replace("/portal/dashboard");
      }
    }

    handleAuthRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center font-mono text-xs">
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[#111015] border border-white/10">
        <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        <span>AUTHENTICATING PORTAL SESSION...</span>
      </div>
    </div>
  );
}
