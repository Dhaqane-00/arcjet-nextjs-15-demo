import arcjet from "@arcjet/next";

// Create base Arcjet instance with shared configuration
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"], // Track by IP
  rules: [],
});

// Helper to get metadata from decision
export function getMetadata(decision: any) {
  return {
    ip: decision.metadata?.ip,
    bot: decision.metadata?.bot,
    rateLimit: decision.metadata?.rateLimit,
    shield: decision.metadata?.shield,
  };
}
