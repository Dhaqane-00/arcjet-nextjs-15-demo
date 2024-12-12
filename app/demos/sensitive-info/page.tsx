"use client";
import { useState } from "react";

const testCases = {
  safe: [
    {
      label: "Product Review",
      input:
        "I absolutely love the wireless headphones I bought last week! The sound quality is amazing and battery life is great. Would definitely recommend to others.",
      description: "Standard product review without PII",
    },
    {
      label: "Support Query",
      input:
        "Having trouble connecting my device to Bluetooth. I've tried restarting it and following the manual but no luck. Can you help?",
      description: "Technical support question without sensitive data",
    },
    {
      label: "Order Status",
      input:
        "Hi, I placed an order last week for a blue t-shirt. Could you tell me when it will be shipped? Order #12345",
      description: "Order inquiry with non-sensitive reference number",
    },
  ],
  sensitive: [
    {
      label: "Refund Request with Email",
      input:
        "I ordered a hat from your store and would like to request a refund. Please contact me at john.smith@gmail.com or call 555-0123-4567.",
      description: "Contains email and phone number",
    },
    {
      label: "Payment Issue",
      input:
        "I ordered a hat from your store and would like to request a refund. My credit card number is 4111111111111111 ",
      description: "Contains credit card number",
    },
    {
      label: "Technical Issue",
      input:
        "I can't connect to my home network. My IP is 192.168.1.1 and my router's MAC address is 00:1A:2B:3C:4D:5E",
      description: "Contains IP address and MAC address",
    },
    {
      label: "Account Update",
      input: "Please update my account Phone number: +15559876543",
      description: "Contains phone number",
    },
    {
      label: "Mixed Support Request",
      input:
        "Having issues with my recent purchase on order #5431.\nContact: alice@example.com\nShipping: 123 Main St, Apt 4B\nCard: 4111-2222-3333-4444\nPhone: +1-555-123-4567",
      description: "Mix of order info and sensitive data",
    },
  ],
};

export default function SensitiveInfoDemo() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSensitiveInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/arcjet/sensitive-info", {
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
    // Automatically test after selecting
    fetch("/api/arcjet/sensitive-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: testInput }),
    })
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((error) => setResult({ error: "Request failed" }));
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Sensitive Information Detection
      </h1>
      <p className="mb-6 text-gray-600">
        Test Arcjet's ability to detect and protect sensitive information. Try
        the pre-defined test cases or enter your own text.
      </p>

      <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-semibold">
          Test for Sensitive Information
        </h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter text to test for sensitive information..."
          rows={4}
        />
        <button
          onClick={testSensitiveInfo}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Testing..." : "Test Input"}
        </button>
      </div>

      {result && (
        <div className="mb-8">
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

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Safe Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600">Safe Content</h2>
          <div className="space-y-2">
            {testCases.safe.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-green-500 cursor-pointer"
                onClick={() => tryTestCase(test.input)}
              >
                <h3 className="font-medium text-green-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
                  {test.input}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Sensitive Content */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">
            Sensitive Content
          </h2>
          <div className="space-y-2">
            {testCases.sensitive.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-red-500 cursor-pointer"
                onClick={() => tryTestCase(test.input)}
              >
                <h3 className="font-medium text-red-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
                  {test.input}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-2">
          Protected Information Types
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          <li>Credit Card Numbers (various formats)</li>
          <li>Email Addresses</li>
          <li>Phone Numbers (international formats)</li>
          <li>IP Addresses</li>
          <li>Social Security Numbers</li>
          <li>Other PII patterns can be added</li>
        </ul>
      </div>
    </div>
  );
}
