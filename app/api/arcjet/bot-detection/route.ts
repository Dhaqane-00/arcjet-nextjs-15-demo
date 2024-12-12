import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { detectBot } from "@arcjet/next";

/**
 * Bot Detection API Route
 *
 * This route demonstrates Arcjet's bot detection capabilities.
 * It helps identify and block automated traffic to your API.
 *
 * Bot detection looks for signs that a request might be automated:
 * - Suspicious patterns in request timing
 * - Unusual browser fingerprints
 * - Known bot signatures
 * - Machine-like behavior patterns
 *
 * Think of it as a smart security system that can tell the difference
 * between real users and automated programs trying to access your API.
 *
 * The route shows how to:
 * 1. Set up bot detection rules
 * 2. Handle requests identified as bots
 * 3. Allow legitimate automated traffic (like good bots)
 */
export async function GET(req: Request) {
  // Initialize bot detection with specified rules
  // The empty allow array means no bots are explicitly allowed
  const decision = await aj
    .withRule(
      detectBot({
        mode: "LIVE", // Actively enforce bot detection
        allow: [], // No bots are whitelisted
      })
    )
    .protect(req);

  // If bot traffic is detected, return 403 Forbidden
  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Bot Traffic Detected",
        reason: decision.reason, // Contains details about why it was flagged as a bot
      },
      { status: 403 }
    );
  }

  // If traffic appears to be from a human, allow it
  return NextResponse.json({
    message: "Human traffic allowed",
    reason: decision.reason, // Contains details about the decision
  });
}
