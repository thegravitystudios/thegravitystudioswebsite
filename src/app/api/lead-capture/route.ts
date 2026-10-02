import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const leadData = await req.json();
    console.log("=== NEW LEAD CAPTURED ===", JSON.stringify(leadData, null, 2));

    return NextResponse.json({
      status: "success",
      message: "Lead recorded successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lead capture API error:", error);
    return NextResponse.json(
      { error: "Failed to record lead" },
      { status: 500 }
    );
  }
}
