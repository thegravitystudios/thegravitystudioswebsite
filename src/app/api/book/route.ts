import { NextResponse } from "next/server";

export interface BookingRequest {
  id?: string;
  eventType: "intro-15" | "strategy-45" | "deepdive-60";
  eventTitle?: string;
  durationMinutes?: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "03:00 PM"
  timezone: string;
  brandName: string;
  clientName: string;
  email: string;
  phone?: string;
  website?: string;
  bottleneck?: string;
  budget?: string;
  sourceDomain?: string;
  meetingLink?: string;
  createdAt?: string;
}

// Global In-Memory Store for Bookings
const globalBookings: BookingRequest[] = [
  {
    id: "bk-101",
    eventType: "strategy-45",
    eventTitle: "45-Min Discovery & Strategy Session",
    durationMinutes: 45,
    date: "2026-09-10",
    timeSlot: "04:00 PM",
    timezone: "Asia/Kolkata (IST)",
    brandName: "Aura Apparel",
    clientName: "Rohan Sharma",
    email: "rohan@auraapparel.in",
    phone: "+91 98200 12345",
    website: "https://auraapparel.in",
    bottleneck: "Our Ads Aren't Performing",
    budget: "$5,000 - $10,000 / mo",
    sourceDomain: "The Gravity Studios",
    meetingLink: "https://meet.google.com/tgs-strategy-call",
    createdAt: new Date().toISOString(),
  },
];

// Available Time Slots Engine (IST Base, Auto-converted)
const DEFAULT_TIME_SLOTS = [
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:30 PM",
  "07:30 PM",
];

// Helper to check CORS headers for multi-site embedding
function getCorsHeaders(request: Request) {
  const origin = request.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  // Filter out booked slots for requested date
  const bookedSlots = globalBookings
    .filter((b) => b.date === date)
    .map((b) => b.timeSlot);

  const availableSlots = DEFAULT_TIME_SLOTS.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  return NextResponse.json(
    {
      date,
      availableSlots,
      allSlots: DEFAULT_TIME_SLOTS,
      bookings: globalBookings,
    },
    { headers: getCorsHeaders(request) }
  );
}

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();

    if (!body.email || !body.brandName || !body.date || !body.timeSlot) {
      return NextResponse.json(
        { error: "Missing required fields: email, brandName, date, or timeSlot" },
        { status: 400, headers: getCorsHeaders(request) }
      );
    }

    const meetingId = `tgs-${Math.random().toString(36).substring(2, 9)}`;
    const newBooking: BookingRequest = {
      ...body,
      id: `bk-${Date.now()}`,
      sourceDomain: body.sourceDomain || "The Gravity Studios",
      meetingLink: `https://meet.google.com/${meetingId}`,
      createdAt: new Date().toISOString(),
    };

    globalBookings.unshift(newBooking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking confirmed successfully!",
        booking: newBooking,
      },
      { status: 201, headers: getCorsHeaders(request) }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: getCorsHeaders(request) }
    );
  }
}
