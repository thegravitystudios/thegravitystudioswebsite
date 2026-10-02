import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { clientId, title, linkType, url, description } = await req.json();

    if (!clientId || !title || !url) {
      return NextResponse.json({ error: "Client ID, title, and URL are required" }, { status: 400 });
    }

    const { data: link, error } = await supabaseAdmin
      .from("project_links")
      .insert({
        client_id: clientId,
        title,
        link_type: linkType || "google_drive",
        url,
        description,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, link });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add asset link" }, { status: 500 });
  }
}
