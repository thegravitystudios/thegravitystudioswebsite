import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://idvvtjppunmwtwjkldih.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const headers = {
    "Content-Type": "application/json",
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  try {
    const adminEmail = "admin@thegravitystudios.com";
    const adminPass = "GravityAdmin2026!";
    const clientEmail = "client@thegravitystudios.com";
    const clientPass = "GravityClient2026!";

    // 1. Create or Update Admin Auth User via REST API
    let adminUserId: string | null = null;
    const createAdminRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: adminEmail,
        password: adminPass,
        email_confirm: true,
        user_metadata: { full_name: "Prameet Patani (Admin)", role: "admin" },
      }),
    });
    const adminJson = await createAdminRes.json();

    if (createAdminRes.ok && adminJson?.id) {
      adminUserId = adminJson.id;
    } else {
      // Fetch users list to find ID
      const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers });
      const listJson = await listRes.json();
      const existingAdmin = listJson.users?.find((u: any) => u.email === adminEmail);
      if (existingAdmin) {
        adminUserId = existingAdmin.id;
        // Update password
        await fetch(`${supabaseUrl}/auth/v1/admin/users/${adminUserId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ password: adminPass }),
        });
      }
    }

    if (adminUserId) {
      // Upsert profile
      await fetch(`${supabaseUrl}/rest/v1/profiles`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({
          id: adminUserId,
          full_name: "Prameet Patani (Admin)",
          role: "admin",
        }),
      });
    }

    // 2. Create or Update Client Auth User via REST API
    let clientUserId: string | null = null;
    const createClientRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: clientEmail,
        password: clientPass,
        email_confirm: true,
        user_metadata: { full_name: "Anand Verma", role: "client" },
      }),
    });
    const clientJson = await createClientRes.json();

    if (createClientRes.ok && clientJson?.id) {
      clientUserId = clientJson.id;
    } else {
      const listRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, { headers });
      const listJson = await listRes.json();
      const existingClient = listJson.users?.find((u: any) => u.email === clientEmail);
      if (existingClient) {
        clientUserId = existingClient.id;
        await fetch(`${supabaseUrl}/auth/v1/admin/users/${clientUserId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ password: clientPass }),
        });
      }
    }

    if (clientUserId) {
      // Upsert Client profile
      await fetch(`${supabaseUrl}/rest/v1/profiles`, {
        method: "POST",
        headers: { ...headers, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({
          id: clientUserId,
          full_name: "Anand Verma",
          role: "client",
        }),
      });

      // Upsert Client company
      let clientId: string | null = null;
      const clientCompRes = await fetch(`${supabaseUrl}/rest/v1/clients?company_name=eq.Hero%20Motors&select=id`, {
        headers,
      });
      const clientCompJson = await clientCompRes.json();

      if (Array.isArray(clientCompJson) && clientCompJson.length > 0) {
        clientId = clientCompJson[0].id;
      } else {
        const newCompRes = await fetch(`${supabaseUrl}/rest/v1/clients`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify({ company_name: "Hero Motors" }),
        });
        const newCompJson = await newCompRes.json();
        if (Array.isArray(newCompJson) && newCompJson.length > 0) {
          clientId = newCompJson[0].id;
        }
      }

      if (clientId) {
        // Link client_members
        await fetch(`${supabaseUrl}/rest/v1/client_members`, {
          method: "POST",
          headers: { ...headers, Prefer: "resolution=merge-duplicates" },
          body: JSON.stringify({
            client_id: clientId,
            user_id: clientUserId,
          }),
        });

        // Ensure Demo Project exists
        const projRes = await fetch(`${supabaseUrl}/rest/v1/projects?client_id=eq.${clientId}&select=id`, { headers });
        const projJson = await projRes.json();

        if (Array.isArray(projJson) && projJson.length === 0) {
          const newProjRes = await fetch(`${supabaseUrl}/rest/v1/projects`, {
            method: "POST",
            headers: { ...headers, Prefer: "return=representation" },
            body: JSON.stringify({
              client_id: clientId,
              name: "Hero Motors Commercial Campaign",
              description: "Full-scale brand film and social content pipeline for upcoming vehicle launch.",
              phase: "production",
              status: "on_track",
              start_date: "2026-09-01",
              target_end_date: "2026-10-31",
              internal_notes: "Client priority project. Lead producer: Prameet.",
            }),
          });
          const newProjJson = await newProjRes.json();
          if (Array.isArray(newProjJson) && newProjJson.length > 0) {
            const pId = newProjJson[0].id;

            // Insert Video
            await fetch(`${supabaseUrl}/rest/v1/videos`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                project_id: pId,
                name: "Hero Motors Commercial Cut v1",
                file_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                revision_round: 1,
                max_revisions: 2,
                status: "pending_review",
              }),
            });

            // Insert Invoice
            await fetch(`${supabaseUrl}/rest/v1/invoices`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                project_id: pId,
                invoice_number: "TGS-2026-001",
                amount: 250000,
                currency: "INR",
                due_date: "2026-09-15",
                status: "unpaid",
              }),
            });

            // Insert Activity
            await fetch(`${supabaseUrl}/rest/v1/activity_log`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                project_id: pId,
                action: "Project initialized and video cut v1 uploaded for review.",
              }),
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Client and Admin accounts created/updated successfully in Supabase!",
      accounts: {
        admin: {
          url: "https://www.thegravitystudios.com/portal/login",
          email: adminEmail,
          password: adminPass,
          role: "admin",
        },
        client: {
          url: "https://www.thegravitystudios.com/portal/login",
          email: clientEmail,
          password: clientPass,
          role: "client",
          company: "Hero Motors",
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to seed accounts" }, { status: 500 });
  }
}
