"use client";
import { useState, useEffect } from "react";

interface RequestResult {
  timestamp: string;
  duration: number;
  status: number;
  data?: {
    message: string;
    remainingTokens?: number;
    resetTime?: string;
  };
  error?: string;
}

export default function RateLimitDemo() {
  const [requests, setRequests] = useState<RequestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<number>(10);
  const [resetTime, setResetTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    // Only start countdown if we're not at full capacity
    if (tokens < 10 && resetTime) {
      const countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = resetTime.getTime() - now.getTime();

        if (diff <= 0) {
          // Time to refill tokens
          setTokens((prev) => Math.min(prev + 5, 10));
          if (tokens + 5 < 10) {
            // If we're still not at capacity, set next reset time
            setResetTime(new Date(now.getTime() + 10000));
          } else {
            // We're at or above capacity
            setResetTime(null);
            setTimeLeft("");
          }
        } else {
          // Update countdown
          const seconds = Math.ceil(diff / 1000);
          setTimeLeft(`${seconds}s`);
        }
      }, 100); // More frequent updates for smoother countdown

      return () => clearInterval(countdownInterval);
    }
  }, [tokens, resetTime]);

  const makeRequest = async () => {
    setLoading(true);
    try {
      const startTime = Date.now();
      const res = await fetch("/api/arcjet/rate-limit");
      const data = await res.json();
      const endTime = Date.now();

      const result = {
        timestamp: new Date().toISOString(),
        duration: endTime - startTime,
        status: res.status,
        data,
      };

      // Update tokens and reset time based on server response
      if (data.remainingTokens !== undefined) {
        setTokens(data.remainingTokens);
        // Only set reset time if we're not at capacity
        if (data.remainingTokens < 10 && data.resetTime) {
          setResetTime(new Date(data.resetTime));
        } else {
          setResetTime(null);
          setTimeLeft("");
        }
      }

      setRequests((prev) => [result, ...prev]);
    } catch (error) {
      const result = {
        timestamp: new Date().toISOString(),
        status: 500,
        error: "Request failed",
        duration: 0,
      };
      setRequests((prev) => [result, ...prev]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Rate Limiting Demo</h1>
      <p className="mb-6 text-gray-600">
        Test Arcjet's rate limiting capabilities. The system uses a token bucket
        algorithm with a capacity of 10 tokens, refilling 5 tokens every 10
        seconds.
      </p>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={makeRequest}
          disabled={loading}
          className={`px-6 py-3 rounded ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Making Request..." : "Make Request"}
        </button>

        <div className="text-sm">
          <span className="font-medium">Tokens remaining: </span>
          <span className={tokens === 0 ? "text-red-500" : "text-green-500"}>
            {tokens}
          </span>
        </div>

        <div className="text-sm">
          <span className="font-medium">Next token refill in: </span>
          <span className="text-blue-500">
            {tokens < 10 ? timeLeft : "Full"}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Request History</h2>
        <ul className="space-y-2">
          {requests.map((req, i) => (
            <li
              key={i}
              className={`p-4 rounded flex items-center justify-between ${
                req.status === 429
                  ? "bg-red-50 border border-red-200"
                  : req.status === 200
                  ? "bg-green-50 border border-green-200"
                  : "bg-yellow-50 border border-yellow-200"
              }`}
            >
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">
                    Status: {req.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    Duration: {req.duration}ms
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {req.data ? JSON.stringify(req.data) : req.error}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          <li>Token bucket starts with 10 tokens (capacity)</li>
          <li>Each request consumes 5 tokens</li>
          <li>Tokens refill at a rate of 5 per 10 seconds</li>
          <li>When tokens are depleted, requests are rate limited</li>
          <li>Requests return 429 status code when rate limited</li>
        </ul>
      </div>
    </div>
  );
}
