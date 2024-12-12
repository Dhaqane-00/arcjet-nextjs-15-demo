"use client";

export default function ShieldDemo() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Shield WAF Protection Demo</h1>
      <p className="mb-6 text-gray-600">
        Test Arcjet's Shield WAF protection by simulating requests from
        suspicious IPs. Run the following curl command in your terminal to test
        the protection:
      </p>

      <div className="border rounded p-4 mb-8">
        <h3 className="font-medium text-blue-700 mb-2">Suspicious IP Test</h3>
        <p className="text-sm text-gray-600 mb-4">
          This command simulates a request from a suspicious IP address. The
          header "x-arcjet-suspicious: true" triggers Arcjet's Shield
          protection.
        </p>
        <pre className="text-sm bg-gray-50 p-4 rounded">
          curl -v -H "x-arcjet-suspicious: true"
          http://localhost:3000/api/arcjet/shield
        </pre>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
        <h3 className="font-medium text-blue-700 mb-2">Expected Behavior</h3>
        <p className="text-sm text-gray-600">
          When you run this command, Arcjet's Shield protection should detect
          the suspicious IP and block the request. You should see a response
          indicating that the request was blocked for security reasons.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <h3 className="font-medium text-yellow-700 mb-2">Rate Limiting</h3>
        <p className="text-sm text-gray-600">
          In addition to Shield protection, requests are rate limited using a
          fixed window. Each IP address is limited to 5 successful requests per
          60 second window. If you exceed this limit, subsequent requests will
          be blocked until the window resets. This helps prevent abuse while
          allowing legitimate usage.
        </p>
      </div>
    </div>
  );
}
