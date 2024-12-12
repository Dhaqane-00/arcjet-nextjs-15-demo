import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { tokenBucket } from "@arcjet/next";

export async function GET(req: Request) {
  const decision = await aj
    .withRule(
      tokenBucket({
        mode: "LIVE",
        refillRate: 5,
        interval: 10,
        capacity: 10,
      })
    )
    .protect(req, {
      requested: 5,
    });

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Rate Limit Exceeded",
        reason: decision.reason,
      },
      { status: 429 }
    );
  }

  return NextResponse.json({
    message: "Request allowed",
    reason: decision.reason,
  });
}
