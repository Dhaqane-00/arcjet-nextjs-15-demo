import { NextResponse } from "next/server";
import { aj } from "@/lib/arcjet";
import { tokenBucket } from "@arcjet/next";

/**
 * Rate Limiting API Route
 *
 * This route shows how to implement rate limiting with Arcjet.
 * Rate limiting prevents abuse by controlling how many requests
 * a user or IP address can make within a certain time period.
 *
 * It's like having a ticket system at a theme park:
 * - Each person can only ride (make requests) X times per hour
 * - After using all tickets, they must wait
 * - Prevents any one person from hogging the ride
 *
 * The route demonstrates:
 * - How to set rate limit rules
 * - What happens when limits are exceeded
 * - How to handle rate-limited requests
 * - How to communicate limits to users
 */
export async function POST(request: Request) {
  try {
    const { isLoggedIn } = await request.json();

    // Set up rate limiting using the token bucket algorithm with different rules
    // based on whether the user is logged in or not
    let result;

    if (isLoggedIn) {
      // Logged in users get more generous rate limits
      result = await aj
        .withRule(
          tokenBucket({
            mode: "LIVE",
            refillRate: 10, // Higher refill rate for logged in users
            interval: 10, // Interval in seconds
            capacity: 20, // Higher capacity for logged in users
          })
        )
        .protect(request, {
          requested: 5,
        });
    } else {
      // Anonymous users get more restrictive rate limits
      result = await aj
        .withRule(
          tokenBucket({
            mode: "LIVE",
            refillRate: 3, // Lower refill rate for anonymous users
            interval: 10, // Interval in seconds
            capacity: 5, // Lower capacity for anonymous users
          })
        )
        .protect(request, {
          requested: 5,
        });
    }

    // Extract rate limit information from the response
    // @ts-ignore
    const remaining = result.reason.remaining;
    // @ts-ignore
    const reset = result.reason.resetTime;

    const country = result.ip.countryName ? result.ip.countryName : null;

    if (result.isDenied()) {
      return NextResponse.json(
        {
          message: "Rate limit exceeded",
          remainingTokens: Number(remaining) || 0,
          resetTime: reset,
          isLoggedIn,
          country,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      message: "Request successful",
      remainingTokens: Number(remaining),
      resetTime: reset,
      isLoggedIn,
      country,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
