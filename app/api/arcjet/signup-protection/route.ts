import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { protectSignup } from "@arcjet/next";

/**
 * Signup Protection API Route
 *
 * This route shows how to protect your signup/registration endpoints
 * from various types of abuse:
 *
 * - Prevents spam account creation
 * - Blocks automated signup attempts
 * - Blocks bots from signing up
 * - Protects against credential stuffing attacks
 *
 * The route simulates a signup process and shows how Arcjet
 * can protect it from abuse.
 */

export async function POST(req: Request) {
  // Extract email from request body for validation
  const { email } = await req.json();

  // Set up signup protection with multiple security layers
  const decision = await aj
    .withRule(
      protectSignup({
        // Email validation rules
        email: {
          mode: "LIVE",
          block: [
            "DISPOSABLE", // Block temporary/disposable email services
            "NO_MX_RECORDS", // Block emails with invalid mail servers
            "INVALID", // Block malformed email addresses
          ],
        },
        // Bot detection settings for signup attempts
        bots: {
          mode: "LIVE",
          allow: [], // No bots are allowed to sign up
        },
        // Rate limiting for signup attempts
        rateLimit: {
          mode: "LIVE",
          interval: "10s", // Time window for rate limiting
          max: 5, // Maximum 5 signup attempts per 10 seconds
        },
      })
    )
    .protect(req, {
      email, // Pass email for validation
    });

  // If any protection rule is triggered, block the signup
  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Signup Protection Triggered",
        reason: decision.reason, // Details about which protection was triggered
      },
      { status: 403 }
    );
  }

  // If all checks pass, allow the signup
  return NextResponse.json({
    message: "Signup allowed",
  });
}
