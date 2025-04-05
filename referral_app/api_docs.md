API Docs
POST /api/referrals

Submits referral information to generate a new referral code.
Example Usage (curl)

curl -X POST http://localhost:5173/api/referrals \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Example Corp",
    "industry": "Technology",
    "contactName": "Jane Doe",
    "contactEmail": "jane.doe@example.com",
    "contactPhone": "123-456-7890",
    "discountPercentage": 15,
    "eventDescription": "Spring Promo"
  }'

Request Payload (JSON Body)

    companyName (string, required): Name of the company being referred.
    industry (string, optional): Industry of the company.
    contactName (string, required): Name of the contact person.
    contactEmail (string, required): Email address of the contact person.
    contactPhone (string, optional): Phone number of the contact person.
    discountPercentage (number, optional): Discount percentage (0-100).
    eventDescription (string, optional): Description of the event or reason for referral.

Success Response (200 OK)

{
  "referralCode": "REF-ABCXYZ123",
  "instructions": "Share this code..."
}

    referralCode (string): The newly generated referral code.
    instructions (string): Instructions for using the code, potentially including the discount.

Error Response (400/500)

{
  "error": "Error message describing the issue (e.g., Missing required fields, Invalid email format)."
}

GET /api/records

Retrieves all previously generated referral records.
Example Usage (curl)

curl http://localhost:5173/api/records

Success Response (200 OK)

Returns an array of Referral Record objects.

[
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
]

    Each object in the array contains all fields defined in the ReferralRecord type.

Error Response (500)

{
  "error": "Failed to fetch records. Please try again."
}

GET /api/statistics

Retrieves calculated statistics about the generated referral codes.
Example Usage (curl)

curl http://localhost:5173/api/statistics

Success Response (200 OK)

Returns a Statistics Response object.

{
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
}

    Contains time series counts, top 10 companies, top 10 popular attributes, and total record count.

Error Response (500)

{
  "error": "Internal server simulation error during statistics calculation."
}

POST /api/sendemail

Sends a generated referral code and instructions to a list of email addresses. (Note: Currently simulated in dev server).
Example Usage (curl)

curl -X POST http://localhost:5173/api/sendemail \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "REF-EXAABC123",
    "instructions": "Share this code...",
    "companyName": "Example Corp",
    "emails": ["test1@example.com", "test2@example.com"]
  }'

Request Payload (JSON Body)

    referralCode (string, required): The code to be sent.
    instructions (string, required): The instructions to include in the email body.
    companyName (string, required): The company name for context.
    emails (string[], required): An array of email addresses to send to.

Success Response (200 OK)

{
  "message": "Simulated sending email to 2 address(es)."
}

    message (string): Confirmation message (note: sending is simulated).

Error Response (500)

{
  "error": "Error message describing the issue."
}

GET /api/export/records

Downloads all referral records as a CSV file.
Example Usage (curl)

# Note: Use -o to save the output to a file
curl http://localhost:5173/api/export/records -o referral_records.csv

Success Response (200 OK)

The response body will be the CSV content. The following headers will be set:

    Content-Type: text/csv
    Content-Disposition: attachment; filename="referral_records.csv"

Error Response (500)

{
  "error": "Internal server simulation error during export."
}