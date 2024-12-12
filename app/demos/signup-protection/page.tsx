"use client";
import { useState } from "react";

const testCases = {
  valid: [
    {
      label: "Valid Gmail",
      email: "user@gmail.com",
      description: "Standard Gmail address",
    },
    {
      label: "Valid Business Email",
      email: "contact@company.com",
      description: "Corporate email address",
    },
    {
      label: "Valid Custom Domain",
      email: "john@mydomain.org",
      description: "Email with custom domain",
    },
  ],
  invalid: [
    {
      label: "Disposable Email",
      email: "temp@10minutemail.com",
      description: "Temporary/disposable email service",
    },
    {
      label: "Invalid Format",
      email: "not-an-email-address",
      description: "Incorrectly formatted email",
    },
    {
      label: "Missing MX Records",
      email: "user@nonexistent-domain.com",
      description: "Domain without mail server",
    },
    {
      label: "Known Spam Domain",
      email: "user@spam-domain.xyz",
      description: "Domain associated with spam",
    },
  ],
};

export default function SignupProtectionDemo() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  const testSignup = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/arcjet/signup-protection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResult(data);
      setRequestCount((prev) => prev + 1);
    } catch (error) {
      setResult({ error: "Request failed" });
    }
    setLoading(false);
  };

  const tryTestCase = (testEmail: string) => {
    setEmail(testEmail);
    // Automatically test after selecting
    fetch("/api/arcjet/signup-protection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setRequestCount((prev) => prev + 1);
      })
      .catch((error) => setResult({ error: "Request failed" }));
  };

  const rapidTest = async () => {
    setLoading(true);
    const results = [];
    for (let i = 0; i < 6; i++) {
      try {
        const res = await fetch("/api/arcjet/signup-protection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        results.push(data);
        setRequestCount((prev) => prev + 1);
      } catch (error) {
        results.push({ error: "Request failed" });
      }
    }
    setResult(results[results.length - 1]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Signup Protection Demo</h1>
      <p className="mb-6 text-gray-600">
        Test Arcjet's signup protection features including email validation,
        rate limiting, and bot detection. Try different types of emails and
        request patterns.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Valid Emails */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600">Valid Emails</h2>
          <div className="space-y-2">
            {testCases.valid.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-green-500 cursor-pointer"
                onClick={() => tryTestCase(test.email)}
              >
                <h3 className="font-medium text-green-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-sm bg-gray-50 p-2 rounded">
                  {test.email}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Invalid Emails */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600">Invalid Emails</h2>
          <div className="space-y-2">
            {testCases.invalid.map((test, index) => (
              <div
                key={index}
                className="border rounded p-4 hover:border-red-500 cursor-pointer"
                onClick={() => tryTestCase(test.email)}
              >
                <h3 className="font-medium text-red-700">{test.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                <pre className="text-sm bg-gray-50 p-2 rounded">
                  {test.email}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Custom Test</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter email to test..."
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={testSignup}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Testing..." : "Test Signup"}
          </button>
          <button
            onClick={rapidTest}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
          >
            Test Rate Limit
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Request count: {requestCount} (Rate limit: 5 per 10 minutes)
        </p>
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
        <h2 className="text-lg font-semibold mb-2">Protection Features</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          <li>Email validation (format, MX records)</li>
          <li>Disposable email detection</li>
          <li>Rate limiting (5 attempts per 10 minutes)</li>
          <li>Bot detection</li>
          <li>Spam domain checking</li>
        </ul>
      </div>
    </div>
  );
}
