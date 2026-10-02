import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { company_name, contact_name, contact_email } = await req.json();

    if (!company_name || !contact_name || !contact_email) {
      return NextResponse.json(
        { error: "Company name, contact name, and email are required." },
        { status: 400 }
      );
    }

    // 1. Create or fetch Client Company
    let clientId: string;
    const { data: existingClient } = await supabaseAdmin
      .from("clients")
      .select("id")
      .ilike("company_name", company_name.trim())
      .maybeSingle();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      const { data: newClient, error: clientErr } = await supabaseAdmin
        .from("clients")
        .insert({ company_name: company_name.trim() })
        .select("id")
        .single();

      if (clientErr || !newClient) {
        return NextResponse.json(
          { error: `Failed to create client company: ${clientErr?.message || "Unknown error"}` },
          { status: 500 }
        );
      }
      clientId = newClient.id;
    }

    // 2. Trigger Supabase Invite Email
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/portal/reset-password`
      : "https://www.thegravitystudios.com/portal/reset-password";

    const { data: inviteData, error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      contact_email.trim(),
      {
        data: {
          full_name: contact_name.trim(),
          role: "client",
        },
        redirectTo: redirectUrl,
      }
    );

    if (inviteErr) {
      return NextResponse.json(
        { error: `Supabase Auth invite error: ${inviteErr.message}` },
        { status: 400 }
      );
    }

    const userId = inviteData.user?.id;

    if (userId) {
      // 3. Ensure profiles record exists with role 'client'
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        full_name: contact_name.trim(),
        role: "client",
      });

      // 4. Link user to client in client_members
      await supabaseAdmin.from("client_members").upsert({
        client_id: clientId,
        user_id: userId,
      });
    }

    return NextResponse.json({
      success: true,
      user: inviteData.user,
      clientId,
      message: `Invitation email sent to ${contact_email} and client company linked!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
