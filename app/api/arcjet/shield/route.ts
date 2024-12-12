import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { fixedWindow, shield } from "@arcjet/next";

/**
 * Shield API Route
 *
 * This route demonstrates Arcjet's Shield feature, which combines multiple protections:
 * - Bot Detection: Identifies and blocks automated threats
 * - Rate Limiting: Prevents abuse by limiting request frequency
 * - Sensitive Info Protection: Protects against data exposure
 *
 * Shield is like a security guard that combines multiple security checks
 * into one powerful protection system.
 *
 * When this API is called:
 * 1. Arcjet checks if the request seems like it's from a bot
 * 2. Checks if the user/IP has made too many requests
 * 3. Scans for sensitive information in the request
 * 4. Either allows or blocks the request based on these checks
 */
export async function GET(req: Request) {
  // Set up Shield protection with multiple security layers
  // Shield combines bot detection, rate limiting, and other protections
  const decision = await aj
    .withRule(
      shield({
        mode: "LIVE", // Actively enforce all Shield protections
      })
    )
    .withRule(
      fixedWindow({
        // Additional rate limiting
        mode: "LIVE",
        max: 5, // Maximum 5 requests
        window: "60s", // Per 60-second window
      })
    )
    .protect(req);

  // Log detailed results from each security check
  for (const result of decision.results) {
    console.log("Rule Result", result);
  }

  // Log the final security decision
  console.log("Conclusion", decision.conclusion);

  // If any security check fails, block the request
  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Security Threat Detected",
        reason: decision.reason, // Details about which security check failed
      },
      { status: 403 }
    );
  }

  // If all security checks pass, allow the request
  return NextResponse.json({
    message: "Request passed security checks",
  });
}
