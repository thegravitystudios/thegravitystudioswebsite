import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. MASTER ADMIN LOGIN (Founder Prameet)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "prameet@thegravitystudios.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gravity2026";

    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        user: {
          role: "admin",
          email: ADMIN_EMAIL,
          name: "Prameet Patani (Founder)",
        },
      });
    }

    // 2. CLIENT LOGIN
    const { data: client, error } = await supabaseAdmin
      .from("clients")
      .select("*")
      .eq("email", cleanEmail)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Simple matching for client passwords
    if (client.password_hash !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        role: "client",
        id: client.id,
        email: client.email,
        name: client.client_name,
        brandName: client.brand_name,
        projectStatus: client.project_status,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}
