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
export async function GET(request: Request) {
  try {
    // Set up rate limiting using the token bucket algorithm
    // - refillRate: 5 tokens added every 10 seconds
    // - capacity: Maximum of 10 tokens can be stored
    // - interval: Time period for token refill (10 seconds)
    const result = await aj
      .withRule(
        tokenBucket({
          mode: "LIVE",
          refillRate: 5, // How many tokens are added per interval
          interval: 10, // Interval in seconds
          capacity: 10, // Maximum tokens that can be accumulated
        })
      )
      .protect(request, {
        requested: 5, // How many tokens this request needs
      });

    // Extract rate limit information from the response
    // These headers tell us about remaining requests and reset time
    // @ts-ignore
    const remaining = result.reason.remaining; // How many tokens are left
    // @ts-ignore
    const reset = result.reason.resetTime; // When tokens will be refilled

    // If rate limit is exceeded, return 429 Too Many Requests
    if (result.isDenied()) {
      return NextResponse.json(
        {
          message: "Rate limit exceeded",
          remainingTokens: Number(remaining) || 0,
          resetTime: reset,
        },
        { status: 429 } // HTTP 429 is the standard code for rate limiting
      );
    }

    // If within rate limit, return success with limit information
    return NextResponse.json({
      message: "Request successful",
      remainingTokens: Number(remaining),
      resetTime: reset,
    });
  } catch (error) {
    // Handle any unexpected errors
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
