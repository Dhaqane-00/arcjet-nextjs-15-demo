"use client";
import { useState } from "react";

const testCases = {
  safe: [
    {
      label: "Regular Text",
      input: "This is a normal message without any sensitive information.",
      description: "Standard text content",
    },
    {
      label: "Product Review",
      input: "Great product, fast shipping! Would recommend to others.",
      description: "Typical user review",
    },
    {
      label: "Public Information",
      input: "Contact us at our store: 123 Main Street, Public Town",
      description: "Business address (non-sensitive)",
    },
  ],
  sensitive: [
    {
      label: "Credit Card",
      input: "My card number is 4532-1234-5678-9012",
      description: "Contains credit card number",
    },
    {
      label: "Email Address",
      input: "You can reach me at private.user@email.com",
      description: "Contains email address",
    },
    {
      label: "Phone Number",
      input: "Call me at +1 (555) 123-4567",
      description: "Contains phone number",
    },
    {
      label: "Mixed PII",
      input:
        "Name: John Doe\nEmail: john@email.com\nPhone: 555-0123\nSSN: 123-45-6789",
      description: "Multiple types of sensitive data",
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

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Custom Input</h2>
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
