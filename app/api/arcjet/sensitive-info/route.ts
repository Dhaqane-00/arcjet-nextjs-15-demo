import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { sensitiveInfo } from "@arcjet/next";

export async function POST(req: Request) {
  const decision = await aj
    .withRule(
      sensitiveInfo({
        mode: "LIVE",
        deny: ["EMAIL", "CREDIT_CARD_NUMBER", "IP_ADDRESS", "PHONE_NUMBER"],
      })
    )
    .protect(req);

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Sensitive Information Detected",
        reason: decision.reason,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "No sensitive information detected",
  });
}
