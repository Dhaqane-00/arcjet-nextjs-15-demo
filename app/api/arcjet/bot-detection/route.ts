import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { detectBot } from "@arcjet/next";

export async function GET(req: Request) {
  const decision = await aj
    .withRule(
      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE"],
      })
    )
    .protect(req);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Bot Traffic Detected",
        reason: decision.reason,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Human traffic allowed",
    reason: decision.reason,
  });
}
