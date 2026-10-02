import { NextResponse } from "next/server";

// Simple in-memory IP rate limiter (10 requests per IP per hour)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 60 * 60 * 1000; // 1 hour
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return false;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return false;
  }

  if (record.count >= 10) {
    return true;
  }

  record.count += 1;
  return false;
}

const SYSTEM_PROMPT = `You are writing a short, personalized content-strategy diagnostic for The Gravity Studios, a content production and creative systems studio. A visitor to the website has submitted their brand name, industry, what they need, their current bottleneck, and their timeline. Generate a genuinely personalized response using their brand name and (if given) their website/social — but ground every claim in the reference material below. Do not invent statistics, percentages, or specific numbers that are not present in this reference material or in what the visitor submitted. You may reason qualitatively and specifically without fabricating data.

Voice: institutional ("we/the studio"), simple and direct, no words like "elevate," "sophisticated," "meticulous," or "exquisite." No pricing. No promises about timelines or outcomes beyond what's in this material.

THE SIX-PHASE SYSTEM (reference these by name and number):
01 Strategy — brand & audience diagnostic, content system architecture, campaign & narrative design.
02 Pre-Production — treatments & creative direction, mood boards & visual references, shot lists/call sheets/scheduling.
03 Production — brand films & commercials, social & campaign content, in-house crew for on-location and studio work.
04 Post-Production — edit/color/sound design, motion graphics & titling, multi-format delivery.
05 Marketing — Meta ads (media buying & optimization), AI-generated ad variants for faster testing, performance tracking against the original strategy.
06 Analysis — dedicated account lead, ongoing reporting & strategy check-ins, fast turnaround on revisions and next steps.

INDUSTRY REFERENCE:
Food & Beverage: Food and beverage brands aren't losing to bigger budgets anymore — they're losing to brands that show up as real people instead of ad units. The category is shifting hard toward ingredient transparency and creator-led storytelling, and brands still running separate content, ad, and retail plans read as disconnected the moment a customer looks closely.
Fashion & Apparel: Fashion is a consistency game before it's a creativity game. Brands posting daily grow engagement over 2x faster than brands that post in bursts, and a consistent visual identity across channels measurably lifts recall and revenue. Most fashion brands don't have a taste problem — they have a cadence problem.
Beauty & Skincare: Beauty audiences reward brands that teach as much as they sell — the accounts winning right now pair trend-relevant, entertaining content with real education, not just product shots. That mix is hard to sustain without a system, which is exactly where most beauty brands stall out.
Health & Wellness / Supplements: Wellness is a trust category before it's a content category — physicians are trusted roughly 15x more than influencers on health claims, which means the brands winning aren't the loudest, they're the most credible. Educational, discovery-driven content consistently outperforms product-first posting here.
Home & Furniture: Home and lifestyle brands compete on feeling as much as function — the visual world a brand builds around a product often matters more than the product page itself. Without a system connecting strategy to what actually gets shot, that world gets inconsistent fast.
D2C & E-Commerce (General, and fallback for unlisted industries like Jewelry & Accessories, Fitness & Sports, Travel & Hospitality, Pet Brands, Kids & Family, Automotive & Luxury): The D2C brands actually growing right now aren't running separate content, ad, and retail plans — they're running one system that says the same thing everywhere a customer sees them. Everyone else is competing against that with fragments.
SaaS & Tech / B2B / Finance & Fintech: Content creation stopped being the hard part for B2B years ago — the real gap is content that actually moves a buyer, and only about a third of B2B teams have anything resembling a repeatable system for making it. The rest are producing ad hoc and wondering why it doesn't compound.
Personal Brand / Creator: Personal brands live or die on consistency and trust, not production value alone. The creators actually building businesses, not just followings, are the ones treating content as a system rather than a stream of one-offs — that shift is what separates a following from a business.
Other: Whatever the category, the pattern holds: brands that treat strategy, production, and distribution as one connected system outperform brands running them as three separate relationships.

BOTTLENECK REFERENCE:
Our Message Isn't Landing: The likely leak point is the handoff between strategy and what actually gets made — a plan that never fully reaches production isn't really a plan, it's a guess. Relevant takeaways: establish a brand & audience diagnostic before any content gets planned (Phase 01); connect performance reporting directly back to the original strategy goals (Phase 06).
Content Takes Too Long to Make: The likely leak point is production capacity — sustaining real creative testing takes 15-50+ fresh variants a month at real ad spend, which most in-house or single-vendor setups can't produce without the craft dropping. Relevant takeaways: lock treatments and shot lists before production starts, so speed doesn't cost craft (Phase 02); build a repeatable production pipeline instead of starting from scratch each time (Phase 03).
Our Ads Aren't Performing: The likely leak point is testing volume — on Meta, only 4-8% of creative tested actually wins, and the average creative fatigues in about 8 days, so accounts that aren't refreshing constantly are running on expired creative more often than they realize. Relevant takeaways: increase creative variant volume, most winners come from testing more, not guessing better (Phase 05); track performance against strategy, not just spend (Phase 06).
Too Many Vendors Not Enough Coordination: The likely leak point is exactly what it sounds like — separate vendors for content, ads, and production means the reasoning behind a campaign rarely survives the handoff between them. Relevant takeaways: consolidate strategy, production, and distribution under one team (Phases 01-06); assign one dedicated account lead who carries context across every phase (Phase 06).
Not Sure Something's Just Off: The likely leak point isn't obvious from the outside either — that's normal, and usually means the gap is systemic rather than any one phase. Relevant takeaways: start with a real brand & audience diagnostic rather than guessing at the fix (Phase 01); use the discovery call to actually pinpoint the gap before committing to a direction.

WHAT YOU NEED REFERENCE:
An End-to-End Content System → Tag: "Phase 01 (Strategy) & Phase 06 (Analysis)". Emphasize: prioritize all six phases, strategy through analysis, run as one connected system, not six vendors.
Content Production → Tag: "Phase 02-04 (Pre-Production–Post-Production)". Emphasize: treatments, mood boards, and a consistent visual system before chasing volume.
Campaign & Ad Design → Tag: "Phase 01 & Phase 05 (Strategy & Marketing)". Emphasize: the campaign idea and its distribution, built by the same team so nothing gets lost between them.
Not Sure Yet → Tag: "Phase 01 (Strategy)". Emphasize: a real diagnostic is the fastest way to find out what's actually needed first.

Return your response as valid JSON matching this exact structure:
{
  "badge": "string — the Timeline label",
  "header": "string — '[Brand Name]'s Content System Blueprint'",
  "focusPipelineTag": "string — e.g. 'Phase 01 (Strategy) & Phase 06 (Analysis)'",
  "diagnosis": "string — 3-4 sentence paragraph",
  "takeaways": ["string", "string", "string"],
  "howWeHelp": [
    { "phase": "string", "description": "string" },
    { "phase": "string", "description": "string" }
  ]
}`;

// Fallback grounding generator if API key is not present or API call fails/times out
function generateFallbackResponse(
  brandName: string,
  industry: string,
  whatYouNeed: string,
  bottleneck: string,
  timeline: string
) {
  const industryInsights: Record<string, string> = {
    "Food & Beverage":
      "Food and beverage brands aren't losing to bigger budgets anymore — they're losing to brands that show up as real people instead of ad units. The category is shifting hard toward ingredient transparency and creator-led storytelling, and brands still running separate content, ad, and retail plans read as disconnected the moment a customer looks closely.",
    "Fashion & Apparel":
      "Fashion is a consistency game before it's a creativity game. Brands posting daily grow engagement over 2x faster than brands that post in bursts, and a consistent visual identity across channels measurably lifts recall and revenue. Most fashion brands don't have a taste problem — they have a cadence problem.",
    "Beauty & Skincare":
      "Beauty audiences reward brands that teach as much as they sell — the accounts winning right now pair trend-relevant, entertaining content with real education, not just product shots. That mix is hard to sustain without a system, which is exactly where most beauty brands stall out.",
    "Health & Wellness / Supplements":
      "Wellness is a trust category before it's a content category — physicians are trusted roughly 15x more than influencers on health claims, which means the brands winning aren't the loudest, they're the most credible. Educational, discovery-driven content consistently outperforms product-first posting here.",
    "Home & Furniture":
      "Home and lifestyle brands compete on feeling as much as function — the visual world a brand builds around a product often matters more than the product page itself. Without a system connecting strategy to what actually gets shot, that world gets inconsistent fast.",
    "D2C & E-Commerce (General)":
      "The D2C brands actually growing right now aren't running separate content, ad, and retail plans — they're running one system that says the same thing everywhere a customer sees them. Everyone else is competing against that with fragments.",
    "SaaS & Tech / B2B":
      "Content creation stopped being the hard part for B2B years ago — the real gap is content that actually moves a buyer, and only about a third of B2B teams have anything resembling a repeatable system for making it. The rest are producing ad hoc and wondering why it doesn't compound.",
    "Personal Brand / Creator":
      "Personal brands live or die on consistency and trust, not production value alone. The creators actually building businesses, not just followings, are the ones treating content as a system rather than a stream of one-offs — that shift is what separates a following from a business.",
  };

  const bottleneckDiagnoses: Record<string, string> = {
    "Our Message Isn't Landing":
      "For " + brandName + ", the likely leak point is the handoff between strategy and what actually gets made — a plan that never fully reaches production isn't really a plan, it's a guess.",
    "Content Takes Too Long to Make":
      "For " + brandName + ", the likely leak point is production capacity — sustaining real creative testing takes 15-50+ fresh variants a month at real ad spend, which most in-house or single-vendor setups can't produce without the craft dropping.",
    "Our Ads Aren't Performing":
      "For " + brandName + ", the likely leak point is testing volume — on Meta, only 4-8% of creative tested actually wins, and the average creative fatigues in about 8 days, so accounts that aren't refreshing constantly are running on expired creative more often than they realize.",
    "Too Many Vendors Not Enough Coordination":
      "For " + brandName + ", the likely leak point is separate vendors for content, ads, and production, meaning the reasoning behind a campaign rarely survives the handoff between them.",
    "Not Sure Something's Just Off":
      "For " + brandName + ", the likely leak point isn't obvious from the outside, which usually means the gap is systemic across strategy and production rather than any single phase.",
  };

  const aimMapping: Record<string, { tag: string; bullet: string }> = {
    "An End-to-End Content System": {
      tag: "Phase 01 (Strategy) & Phase 06 (Analysis)",
      bullet:
        "Prioritize all six phases — strategy through analysis, run as one connected system, not six vendors.",
    },
    "Content Production": {
      tag: "Phase 02–04 (Pre-Production–Post-Production)",
      bullet:
        "Prioritize Phase 02–04 — treatments, mood boards, and a consistent visual system before chasing volume.",
    },
    "Campaign & Ad Design": {
      tag: "Phase 01 & Phase 05 (Strategy & Marketing)",
      bullet:
        "Prioritize Phase 01 & Phase 05 — the campaign idea and its distribution, built by the same team so nothing gets lost.",
    },
    "Not Sure Yet": {
      tag: "Phase 01 (Strategy)",
      bullet:
        "Prioritize Phase 01 — a real brand diagnostic is the fastest way to find out what's actually needed first.",
    },
  };

  const bottleneckTakeaways: Record<string, [string, string]> = {
    "Our Message Isn't Landing": [
      "Establish a brand & audience diagnostic before any content gets planned (Phase 01).",
      "Connect performance reporting directly back to the original strategy goals (Phase 06).",
    ],
    "Content Takes Too Long to Make": [
      "Lock treatments and shot lists before production starts, so speed doesn't cost craft (Phase 02).",
      "Build a repeatable production pipeline instead of starting from scratch each time (Phase 03).",
    ],
    "Our Ads Aren't Performing": [
      "Increase creative variant volume — the data shows most winners come from testing more, not guessing better (Phase 05).",
      "Track performance against strategy, not just spend, to know which variants are actually working (Phase 06).",
    ],
    "Too Many Vendors Not Enough Coordination": [
      "Consolidate strategy, production, and distribution under one team so nothing gets lost in translation (Phases 01–06).",
      "Assign one dedicated account lead who carries context across every phase (Phase 06).",
    ],
    "Not Sure Something's Just Off": [
      "Start with a real brand & audience diagnostic rather than guessing at the fix (Phase 01).",
      "Use the discovery call to actually pinpoint the gap before committing to a direction.",
    ],
  };

  const selectedInsight =
    industryInsights[industry] ||
    "The D2C brands actually growing right now aren't running separate content, ad, and retail plans — they're running one system that says the same thing everywhere a customer sees them.";
  const selectedDiagnosis =
    bottleneckDiagnoses[bottleneck] || bottleneckDiagnoses["Not Sure Something's Just Off"];
  const selectedAim =
    aimMapping[whatYouNeed] || aimMapping["An End-to-End Content System"];
  const selectedTakeaways =
    bottleneckTakeaways[bottleneck] || bottleneckTakeaways["Not Sure Something's Just Off"];

  return {
    badge: timeline.toUpperCase(),
    header: `${brandName}'s Content System Blueprint`,
    focusPipelineTag: selectedAim.tag,
    diagnosis: `${selectedInsight} ${selectedDiagnosis}`,
    takeaways: [selectedTakeaways[0], selectedTakeaways[1], selectedAim.bullet],
    howWeHelp: [
      {
        phase: "Phase 01 — Strategy",
        description: `We map ${brandName}'s content architecture and narrative design before any camera turns on.`,
      },
      {
        phase: "Phase 03 — Production",
        description: `Full in-house crew executing flagship films and ad variants for ${brandName} to one craft standard.`,
      },
      {
        phase: "Phase 05 — Marketing",
        description: `In-house Meta ad media buying and AI variant testing to scale ${brandName}'s acquisition.`,
      },
    ],
  };
}

export async function POST(req: Request) {
  try {
    const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { brandName, website, industry, whatYouNeed, bottleneck, timeline, hp_field } = body;

    // Honeypot Bot Check
    if (hp_field) {
      return NextResponse.json({ error: "Bot submission detected" }, { status: 400 });
    }

    if (!brandName || !industry || !whatYouNeed || !bottleneck || !timeline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // If API key is present, attempt live Claude API call
    if (apiKey) {
      try {
        const userPrompt = `Brand Name: ${brandName}
Website/Social: ${website || "Not provided"}
Industry: ${industry}
What They Need: ${whatYouNeed}
Current Bottleneck: ${bottleneck}
Timeline: ${timeline}`;

        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });

        if (anthropicRes.ok) {
          const resData = await anthropicRes.json();
          const responseText = resData.content[0].text;
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.error("Anthropic API call failed, falling back to grounded generator:", err);
      }
    }

    // Fallback grounded response
    const fallbackData = generateFallbackResponse(
      brandName,
      industry,
      whatYouNeed,
      bottleneck,
      timeline
    );
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error("Error generating strategy:", error);
    return NextResponse.json(
      { error: "Failed to generate strategy blueprint" },
      { status: 500 }
    );
  }
}
