import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { protectSignup } from "@arcjet/next";

export async function POST(req: Request) {
  const { email } = await req.json();

  const decision = await aj
    .withRule(
      protectSignup({
        email: {
          mode: "LIVE",
          block: ["DISPOSABLE", "NO_MX_RECORDS", "INVALID"],
        },
        bots: {
          mode: "LIVE",
          allow: [],
        },
        rateLimit: {
          mode: "LIVE",
          interval: "10m",
          max: 5,
        },
      })
    )
    .protect(req, {
      email,
    });

  if (decision.isDenied()) {
    return NextResponse.json(
      {
        error: "Signup Protection Triggered",
        reason: decision.reason,
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Signup allowed",
  });
}
