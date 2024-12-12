import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { shield } from "@arcjet/next";

export async function POST(req: Request) {
  const decision = await aj
    .withRule(
      shield({
        mode: "LIVE",
      })
    )
    .protect(req);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Security Threat Detected",
        reason: decision.reason,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Request passed security checks",
  });
}
