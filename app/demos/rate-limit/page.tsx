"use client";
import { useState } from "react";

const testScenarios = [
  {
    label: "Single Request",
    description: "Make a single request to test basic functionality",
    requests: 1,
    delayMs: 0,
  },
  {
    label: "Burst Requests",
    description: "Make multiple requests quickly to trigger rate limiting",
    requests: 10,
    delayMs: 100,
  },
  {
    label: "Spaced Requests",
    description: "Make requests with delays to test token refill",
    requests: 5,
    delayMs: 2000,
  },
  {
    label: "Overflow Test",
    description: "Exceed the rate limit to see enforcement",
    requests: 15,
    delayMs: 200,
  },
];

export default function RateLimitDemo() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const makeRequest = async () => {
    try {
      const startTime = Date.now();
      const res = await fetch("/api/arcjet/rate-limit");
      const data = await res.json();
      const endTime = Date.now();

      return {
        timestamp: new Date().toISOString(),
        duration: endTime - startTime,
        status: res.status,
        data,
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        error: "Request failed",
      };
    }
  };

  const runScenario = async (scenario: (typeof testScenarios)[0]) => {
    setLoading(true);
    setActiveScenario(scenario.label);
    setRequests([]);

    for (let i = 0; i < scenario.requests; i++) {
      const result = await makeRequest();
      setRequests((prev) => [...prev, result]);
      if (scenario.delayMs > 0) {
        await sleep(scenario.delayMs);
      }
    }

    setLoading(false);
    setActiveScenario(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Rate Limiting Demo</h1>
      <p className="mb-6 text-gray-600">
        Test Arcjet's rate limiting capabilities with different request
        patterns. The system uses a token bucket algorithm with a capacity of 10
        tokens, refilling 5 tokens every 10 seconds.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {testScenarios.map((scenario) => (
          <div key={scenario.label} className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">{scenario.label}</h3>
            <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              <div>Requests: {scenario.requests}</div>
              <div>Delay: {scenario.delayMs}ms</div>
            </div>
            <button
              onClick={() => runScenario(scenario)}
              disabled={loading}
              className={`w-full px-4 py-2 rounded ${
                activeScenario === scenario.label
                  ? "bg-blue-200 cursor-not-allowed"
                  : loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {activeScenario === scenario.label
                ? "Running..."
                : "Run Scenario"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Request History</h2>
        <div className="space-y-2">
          {requests.map((req, i) => (
            <div
              key={i}
              className={`p-4 rounded ${
                req.status === 429
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Request #{i + 1}</span>
                <span>{req.duration}ms</span>
              </div>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(req.data || req.error, null, 2)}
              </pre>
            </div>
          ))}
        </div>
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
