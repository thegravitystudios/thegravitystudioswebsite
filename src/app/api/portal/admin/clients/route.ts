import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data: clients, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ clients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { clientName, brandName, email, password, projectStatus } = await req.json();

    if (!clientName || !brandName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: client, error } = await supabaseAdmin
      .from("clients")
      .insert({
        client_name: clientName,
        brand_name: brandName,
        email: email.trim().toLowerCase(),
        password_hash: password,
        project_status: projectStatus || "In Production",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, client });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create client" }, { status: 500 });
  }
}
