import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";

export async function GET(req: Request) {
  const decision = await aj.protect(req);

  console.log("Arcjet Decision:", decision);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Request Denied",
        reason: decision.reason,
        // details: decision,
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
  const body = await req.json();

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
