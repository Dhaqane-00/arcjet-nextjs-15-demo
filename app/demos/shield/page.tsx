"use client";
import { useState } from "react";

const testCases = {
  safe: [
    {
      label: "Normal Search Query",
      input: "search for products where category is electronics",
      description: "A legitimate search query",
    },
    {
      label: "User Comment",
      input: "Great product! I really enjoyed using it.",
      description: "A normal user comment",
    },
    {
      label: "Form Input",
      input: "John Doe, john@example.com",
      description: "Standard form data",
    },
  ],
  malicious: [
    {
      label: "SQL Injection",
      input: "' OR '1'='1'; DROP TABLE users; --",
      description: "Attempts to manipulate SQL query",
    },
    {
      label: "XSS Attack",
      input: "<script>alert('XSS')</script>",
      description: "Attempts to inject malicious JavaScript",
    },
    {
      label: "Path Traversal",
      input: "../../../etc/passwd",
      description: "Attempts to access system files",
    },
    {
      label: "Command Injection",
      input: "; cat /etc/passwd; rm -rf /",
      description: "Attempts to execute system commands",
    },
  ],
};

export default function ShieldDemo() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testShield = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/arcjet/shield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Request failed" });
    }
    setLoading(false);
  };

  const tryTestCase = (testInput: string) => {
    setInput(testInput);
    // Optional: automatically test after selecting
    testShield();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Shield WAF Protection Demo</h1>
      <p className="mb-6 text-gray-600">
        Test Arcjet's Shield WAF protection against various types of attacks.
        Try the pre-defined test cases or enter your own input.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Safe Inputs */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600">Safe Inputs</h2>
          <div className="space-y-2">
            {testCases.safe.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-green-500 cursor-pointer"
                onClick={() => tryTestCase(test.input)}
              >
                <h3 className="font-medium text-green-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-sm bg-gray-50 p-2 rounded">
                  {test.input}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Malicious Inputs */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">
            Malicious Inputs
          </h2>
          <div className="space-y-2">
            {testCases.malicious.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-red-500 cursor-pointer"
                onClick={() => tryTestCase(test.input)}
              >
                <h3 className="font-medium text-red-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-sm bg-gray-50 p-2 rounded">
                  {test.input}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Custom Input</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your own test input..."
          rows={3}
        />
        <button
          onClick={testShield}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Testing..." : "Test Input"}
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
    </div>
  );
}
