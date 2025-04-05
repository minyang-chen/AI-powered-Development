import React from 'react';

const ApiUsagePage: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">API Docs</h2>

      <div className="space-y-8">
        {/* Section for POST /api/referrals */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-3 border-b pb-2">
            POST /api/referrals
          </h3>
          <p className="text-gray-600 mb-4">
            Submits referral information to generate a new referral code.
          </p>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Example Usage (curl)</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`curl -X POST http://localhost:5173/api/referrals \\
  -H "Content-Type: application/json" \\
  -d '{
    "companyName": "Example Corp",
    "industry": "Technology",
    "contactName": "Jane Doe",
    "contactEmail": "jane.doe@example.com",
    "contactPhone": "123-456-7890",
    "discountPercentage": 15,
    "eventDescription": "Spring Promo"
  }'`}
            </code>
          </pre>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Request Payload (JSON Body)</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-6"> {/* Increased bottom margin */}
            <li><code className="font-semibold">companyName</code> (string, required): Name of the company being referred.</li>
            <li><code className="font-semibold">industry</code> (string, optional): Industry of the company.</li>
            <li><code className="font-semibold">contactName</code> (string, required): Name of the contact person.</li>
            <li><code className="font-semibold">contactEmail</code> (string, required): Email address of the contact person.</li>
            <li><code className="font-semibold">contactPhone</code> (string, optional): Phone number of the contact person.</li>
            <li><code className="font-semibold">discountPercentage</code> (number, optional): Discount percentage (0-100).</li>
            <li><code className="font-semibold">eventDescription</code> (string, optional): Description of the event or reason for referral.</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Success Response (200 OK)</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "referralCode": "REF-ABCXYZ123",
  "instructions": "Share this code..."
}`}
            </code>
          </pre>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2 mb-6"> {/* Increased bottom margin */}
            <li><code className="font-semibold">referralCode</code> (string): The newly generated referral code.</li>
            <li><code className="font-semibold">instructions</code> (string): Instructions for using the code, potentially including the discount.</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Error Response (400/500)</h4>
           <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "error": "Error message describing the issue (e.g., Missing required fields, Invalid email format)."
}`}
            </code>
          </pre>
        </section>

        {/* Section for GET /api/records */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-3 border-b pb-2">
            GET /api/records
          </h3>
          <p className="text-gray-600 mb-4">
            Retrieves all previously generated referral records.
          </p>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Example Usage (curl)</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`curl http://localhost:5173/api/records`}
            </code>
          </pre>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Success Response (200 OK)</h4>
          <p className="text-sm text-gray-700 mb-2">Returns an array of Referral Record objects.</p>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`[
  {
    "id": "rec_167...",
    "companyName": "Example Corp",
    "industry": "Technology",
    "contactName": "Jane Doe",
    "contactEmail": "jane.doe@example.com",
    "contactPhone": "123-456-7890",
    "discountPercentage": 15,
    "eventDescription": "Spring Promo",
    "referralCode": "REF-EXAABC123",
    "createdAt": "2025-04-05T10:00:00.000Z"
  },
  // ... more records
]`}
            </code>
          </pre>
           <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2 mb-6"> {/* Increased bottom margin */}
            <li>Each object in the array contains all fields defined in the <code className="font-semibold">ReferralRecord</code> type.</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Error Response (500)</h4>
           <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "error": "Failed to fetch records. Please try again."
}`}
            </code>
          </pre>
       </section>

        {/* Section for GET /api/statistics */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-3 border-b pb-2">
            GET /api/statistics
          </h3>
          <p className="text-gray-600 mb-4">
            Retrieves calculated statistics about the generated referral codes.
          </p>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Example Usage (curl)</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`curl http://localhost:5173/api/statistics`}
            </code>
          </pre>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Success Response (200 OK)</h4>
          <p className="text-sm text-gray-700 mb-2">Returns a Statistics Response object.</p>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "timeSeries": {
    "daily": { "2025-04-05": 5, "2025-04-04": 3 },
    "weekly": { "2025-W14": 8 },
    "monthly": { "2025-04": 8 }
  },
  "topCompanies": [
    { "name": "Example Corp", "count": 5 },
    { "name": "Another Inc", "count": 3 }
    // ... up to 10
  ],
  "popularity": {
    "industries": [ { "name": "Technology", "count": 6 }, /* ... */ ],
    "events": [ { "name": "Spring Promo", "count": 4 }, /* ... */ ],
    "discounts": [ { "name": "15%", "count": 5 }, { "name": "10%", "count": 2 } /* ... */ ]
  },
  "totalRecords": 8
}`}
            </code>
          </pre>
           <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2 mb-6">
            <li>Contains time series counts, top 10 companies, top 10 popular attributes, and total record count.</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Error Response (500)</h4>
           <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "error": "Internal server simulation error during statistics calculation."
}`}
            </code>
          </pre>
       </section>

        {/* Section for POST /api/send-email */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-3 border-b pb-2">
            POST /api/sendemail
          </h3>
          <p className="text-gray-600 mb-4">
            Sends a generated referral code and instructions to a list of email addresses. (Note: Currently simulated in dev server).
          </p>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Example Usage (curl)</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`curl -X POST http://localhost:5173/api/sendemail \\
  -H "Content-Type: application/json" \\
  -d '{
    "referralCode": "REF-EXAABC123",
    "instructions": "Share this code...",
    "companyName": "Example Corp",
    "emails": ["test1@example.com", "test2@example.com"]
  }'`}
            </code>
          </pre>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Request Payload (JSON Body)</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-6"> {/* Increased bottom margin */}
            <li><code className="font-semibold">referralCode</code> (string, required): The code to be sent.</li>
            <li><code className="font-semibold">instructions</code> (string, required): The instructions to include in the email body.</li>
            <li><code className="font-semibold">companyName</code> (string, required): The company name for context.</li>
            <li><code className="font-semibold">emails</code> (string[], required): An array of email addresses to send to.</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Success Response (200 OK)</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "message": "Simulated sending email to 2 address(es)."
}`}
            </code>
          </pre>
           <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mt-2 mb-6"> {/* Increased bottom margin */}
            <li><code className="font-semibold">message</code> (string): Confirmation message (note: sending is simulated).</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Error Response (500)</h4>
           <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "error": "Error message describing the issue."
}`}
            </code>
          </pre>
       </section>

        {/* Section for GET /api/export/records */}
        <section>
          <h3 className="text-xl font-medium text-gray-700 mb-3 border-b pb-2">
            GET /api/export/records
          </h3>
          <p className="text-gray-600 mb-4">
            Downloads all referral records as a CSV file.
          </p>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Example Usage (curl)</h4>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`# Note: Use -o to save the output to a file
curl http://localhost:5173/api/export/records -o referral_records.csv`}
            </code>
          </pre>
          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Success Response (200 OK)</h4>
          <p className="text-sm text-gray-700 mb-2">
            The response body will be the CSV content. The following headers will be set:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 mb-6">
             <li><code className="font-semibold">Content-Type:</code> text/csv</li>
             <li><code className="font-semibold">Content-Disposition:</code> attachment; filename="referral_records.csv"</li>
          </ul>

          <h4 className="text-lg font-medium text-gray-600 mt-4 mb-2">Error Response (500)</h4>
           <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            <code>
{`{
  "error": "Internal server simulation error during export."
}`}
            </code>
          </pre>
       </section>
      </div>
    </div>
  );
};

export default ApiUsagePage;