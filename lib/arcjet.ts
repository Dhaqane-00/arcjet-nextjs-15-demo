import arcjet, {
  shield,
  detectBot,
  tokenBucket,
  sensitiveInfo,
  protectSignup,
} from "@arcjet/next";

// Create a shared Arcjet instance
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src", "session.id"], // Track by IP and session
  rules: [
    // Shield WAF protection
    shield({
      mode: "LIVE",
    }),

    // Advanced bot detection
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    // Rate Limiting
    tokenBucket({
      mode: "LIVE",
      characteristics: ["session.id"], // if we want to track by user
      refillRate: 5, // refill 5 tokens per interval
      interval: 10, // refill every 10 seconds
      capacity: 10, // bucket maximum capacity of 10 tokens
    }),

    sensitiveInfo({
      // Will block requests. Use "DRY_RUN" to log only
      mode: "LIVE",
      // Requests are analyzed entirely locally and never leave your server.
      // Other types are supported and you can also create detection functions
      // for custom types.
      deny: ["EMAIL", "CREDIT_CARD_NUMBER", "IP_ADDRESS", "PHONE_NUMBER"],
    }),

    protectSignup({
      email: {
        // Will block requests. Use "DRY_RUN" to log only
        mode: "LIVE",
        // Blocks disposable, no MX records, and invalid emails
        block: ["DISPOSABLE", "NO_MX_RECORDS", "INVALID"],
      },
      bots: {
        mode: "LIVE",
        // Prevent bots from submitting forms
        // Specific bots can be allowed
        // See https://arcjet.com/bot-list
        allow: [],
      },
      // It would be unusual for a form to be submitted more
      // than 5 times in 10 minutes from the same IP address
      rateLimit: {
        // Uses a sliding window rate limit
        mode: "LIVE",
        // Counts requests over a 10 minute sliding window
        interval: "10m",
        // Allows 5 submissions within the window
        max: 5,
      },
    }),
  ],
});
