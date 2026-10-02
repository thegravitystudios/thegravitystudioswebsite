import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { clientId, docType, title, content } = await req.json();

    if (!clientId || !docType || !title || !content) {
      return NextResponse.json({ error: "Client ID, document type, title, and content are required" }, { status: 400 });
    }

    const { data: document, error } = await supabaseAdmin
      .from("documents")
      .insert({
        client_id: clientId,
        doc_type: docType,
        title,
        content,
        status: "Published",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, document });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create document" }, { status: 500 });
  }
}
