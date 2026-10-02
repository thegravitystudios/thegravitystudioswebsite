import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // 1. Fetch Client Profile
    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    // 2. Fetch Project Links
    const { data: links } = await supabaseAdmin
      .from("project_links")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    // 3. Fetch Documents
    const { data: documents } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      client,
      links: links || [],
      documents: documents || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch client data" }, { status: 500 });
  }
}
