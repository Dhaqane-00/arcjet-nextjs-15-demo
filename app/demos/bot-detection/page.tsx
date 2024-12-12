"use client";
import { useState } from "react";

const testCases = {
  safe: [
    {
      label: "Regular Browser",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      description: "Standard Chrome browser user agent",
    },
    {
      label: "Mobile Browser",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      description: "iOS Safari mobile browser",
    },
    {
      label: "Google Bot",
      userAgent:
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      description: "Legitimate Google search crawler (allowed)",
    },
  ],
  malicious: [
    {
      label: "Basic Scraper",
      userAgent: "Python-urllib/3.9",
      description: "Simple Python scraping script",
    },
    {
      label: "Fake Browser",
      userAgent: "definitely-not-a-bot-chrome-browser-trust-me",
      description: "Poorly disguised bot",
    },
    {
      label: "Known Bad Bot",
      userAgent: "PetalBot",
      description: "Known aggressive crawler",
    },
    {
      label: "Empty User Agent",
      userAgent: "",
      description: "Missing user agent (suspicious)",
    },
  ],
};

export default function BotDetectionDemo() {
  const [userAgent, setUserAgent] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBotDetection = async (e?: React.MouseEvent) => {
    setLoading(true);
    try {
      const res = await fetch("/api/arcjet/bot-detection", {
        headers: {
          "User-Agent": userAgent || navigator.userAgent,
        },
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Request failed" });
    }
    setLoading(false);
  };

  const tryTestCase = (testUserAgent: string) => {
    setUserAgent(testUserAgent);
    // Automatically test after selecting
    fetch("/api/arcjet/bot-detection", {
      headers: { "User-Agent": testUserAgent },
    })
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((error) => setResult({ error: "Request failed" }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Bot Detection Demo</h1>
      <p className="mb-6 text-gray-600">
        Test Arcjet's bot detection by using different User-Agent strings. Try
        the pre-defined test cases or enter your own User-Agent string.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Legitimate User Agents */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600">
            Legitimate Traffic
          </h2>
          <div className="space-y-2">
            {testCases.safe.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-green-500 cursor-pointer"
                onClick={() => tryTestCase(test.userAgent)}
              >
                <h3 className="font-medium text-green-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-xs bg-gray-50 p-2 rounded break-all">
                  {test.userAgent}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Bot/Suspicious User Agents */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Bot Traffic</h2>
          <div className="space-y-2">
            {testCases.malicious.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-red-500 cursor-pointer"
                onClick={() => tryTestCase(test.userAgent)}
              >
                <h3 className="font-medium text-red-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-xs bg-gray-50 p-2 rounded break-all">
                  {test.userAgent || "(empty)"}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Custom User-Agent</h2>
        <div>
          <input
            type="text"
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter custom User-Agent string..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Current browser's User-Agent: {navigator.userAgent}
          </p>
        </div>
        <button
          onClick={testBotDetection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Testing..." : "Test Bot Detection"}
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <div
            className={`p-4 rounded ${
              result.error
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <pre className="overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          <li>
            Arcjet analyzes the User-Agent string and other request
            characteristics
          </li>
          <li>
            Known good bots (like Google) are allowed based on verification
          </li>
          <li>Suspicious patterns and known bad bots are blocked</li>
          <li>Empty or invalid User-Agents are treated as suspicious</li>
          <li>Bot scores are calculated based on multiple factors</li>
        </ul>
      </div>
    </div>
  );
}
