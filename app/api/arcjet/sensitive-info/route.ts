import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { sensitiveInfo } from "@arcjet/next";

/**
 * Sensitive Information Protection API Route
 *
 * This route demonstrates how Arcjet protects against sensitive
 * information exposure in API requests and responses.
 *
 * It helps prevent accidental or malicious transmission of:
 * - Credit card numbers
 * - Social security numbers
 * - API keys
 * - Other sensitive data patterns
 *
 * Think of it as a security scanner that:
 * 1. Checks all incoming data for sensitive information
 * 2. Alerts or blocks if it finds something risky
 * 3. Helps prevent data leaks before they happen
 *
 * This is especially important for:
 * - Protecting user privacy
 * - Maintaining compliance (GDPR, CCPA, etc.)
 * - Preventing accidental data exposure
 */

export async function POST(req: Request) {
  // Initialize Arcjet protection with sensitive info detection rules
  // The 'mode: "LIVE"' setting means these rules are actively enforced
  // 'deny' specifies which types of sensitive information to block
  const decision = await aj
    .withRule(
      sensitiveInfo({
        mode: "LIVE",
        deny: [
          "EMAIL", // Blocks if email addresses are found
          "CREDIT_CARD_NUMBER", // Blocks credit card numbers
          "IP_ADDRESS", // Blocks IP addresses
          "PHONE_NUMBER", // Blocks phone numbers
        ],
      })
    )
    .protect(req);

  // If sensitive information is detected, return a 403 Forbidden response
  // with details about what was found
  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Sensitive Information Detected",
        reason: decision.reason, // Includes details about what triggered the block
      },
      { status: 403 } // HTTP 403 indicates the request was forbidden
    );
  }

  // If no sensitive information was found, return success message
  return NextResponse.json({
    message: "No sensitive information detected",
  });
}
