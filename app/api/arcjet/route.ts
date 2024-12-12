import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";

/**
 * Main Arcjet API Route
 *
 * This is the primary route that demonstrates basic Arcjet integration.
 * It shows the simplest way to add Arcjet protection to an API endpoint.
 *
 * This route serves as an example of:
 * - How to initialize Arcjet in an API route
 * - Basic request handling with Arcjet protection
 * - How to handle responses when requests are blocked
 *
 * It's like the "Hello World" of Arcjet protection -
 * a starting point to understand how Arcjet works.
 */
export async function GET(req: Request) {
  const decision = await aj.protect(req);

  console.log("Arcjet Decision:", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Request Denied",
        reason: decision.reason,
      },
      {
        // Returns 429 (Too Many Requests) if it's a rate limit violation, 403 (Forbidden) for all other denials such as bot traffic
        status: decision.reason.isRateLimit() ? 429 : 403,
      }
    );
  }

  return NextResponse.json({
    message: "Hello world",
    decision,
  });
}

export async function POST(req: Request) {
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Request Denied",
        reason: decision.reason,
        // details: decision,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Data processed successfully",
    decision,
  });
}
