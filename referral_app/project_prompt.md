**Optimized Requirements Prompt for Referral App Code Generation (v3)**

**1. Project Goal:**
Develop a single-page React application using Vite and TypeScript for generating and managing referral codes. The application should feature distinct sections for code generation, viewing records, viewing API documentation, and viewing usage statistics. Styling should be implemented using Tailwind CSS.

**2. Technology Stack:**
*   Frontend Framework: React with TypeScript
*   Build Tool: Vite
*   Styling: Tailwind CSS
*   Routing: Client-side routing library (e.g., `react-router-dom`)
*   Form Handling: Form management library (e.g., `react-hook-form`)
*   Data Fetching: HTTP client library (e.g., `axios`)
*   Charting: JavaScript charting library (e.g., `recharts`) - Assume it will be installed.
*   API Simulation: Custom Vite plugin (Node.js `http`, `fs`, `path`)

**3. Core Features & UI:**

*   **Overall Layout:**
    *   A consistent header should appear on all pages, displaying a small application logo (`/vite.svg`) followed by the title "Referral Code Generator", centered horizontally.
    *   A primary navigation bar should appear below the header, centered horizontally, with links: "Generate Code", "View Records", "API Docs", "Statistics". The active link should be visually distinct.
    *   A main content area below the navigation where page-specific content is rendered.
    *   A simple footer with copyright information.
*   **Generate Code Page:**
    *   Display clear instructions for using the form.
    *   Include a form for submitting referral details.
    *   Show loading indicators during form submission.
    *   Upon successful submission:
        *   Display the generated referral code prominently.
        *   Show instructions for using the code (dynamically including any discount).
        *   Provide an interface to input comma-separated email addresses and a "Send Email" button to trigger sending the code/instructions (via simulated API). Display success/error messages for the email action.
        *   Include a "Generate Another Code" button to clear the success message and reset the form.
    *   Display clear error messages if form submission fails.
*   **Referral Form Component:**
    *   Collect the following information:
        *   Company Name (Required)
        *   Industry (Optional, Dropdown with predefined options: Technology, Finance, Retail, Healthcare, Education, Other)
        *   Contact Name (Required)
        *   Contact Email (Required, Validated format)
        *   Contact Phone (Optional)
        *   Discount Percentage (Optional, Numeric input, validated 0-100)
        *   Event Description (Optional, Multi-line text input)
    *   Perform client-side validation for required fields and formats, displaying clear error messages near the relevant fields.
    *   Include a "Generate Code" submit button, styled distinctively (e.g., blue) and disabled while submitting. Make the button visually larger than default form buttons.
    *   **Layout:** The form should be centered horizontally, occupying approximately 80% of its container's width. Ensure adequate vertical spacing between form fields and labels. Add extra vertical space before the submit button. Style labels clearly (e.g., gray text).
*   **View Records Page:**
    *   Display the title "Generated Referral Records" (use a slightly smaller font size than the main app title).
    *   Include a search section with an input field for entering a referral code and a "Find" button. Ensure adequate vertical space below this section.
    *   Implement client-side search logic: when "Find" is clicked, search through all fetched records for a matching code (case-insensitive).
    *   **Display Logic:**
        *   If loading data, show a "Loading..." message.
        *   If an error occurs during data fetch, show an error message.
        *   If a search is performed and a record is found, display the full details of that single record clearly. Include a button to "Show All Records" (clears the search).
        *   If a search is performed and no record is found, display a "Record not found" message.
        *   If no search is active and records exist, display a paginated table of all records.
        *   If no records exist (and no search is active), display a "No records found" message.
    *   **Paginated Table:**
        *   Display 10 records per page.
        *   Include columns for: Company Name, Date Created, Referral Code, Contact Name, Contact Email, Discount (%), Industry, Contact Phone, Event Description.
        *   Make column headers clickable to sort the displayed data (client-side sorting, ascending/descending). Indicate the currently sorted column and direction visually.
        *   Provide "Previous" and "Next" buttons for pagination, disabling them appropriately. Display the current range of records being shown (e.g., "Showing 1-10 of 50 results").
*   **API Documentation Page:**
    *   Page Title: "API Docs".
    *   Provide clear documentation for each simulated API endpoint.
    *   For each endpoint, include: Method (GET/POST), Path, Description, Request Payload details (if applicable, listing parameters, types, required/optional), Success Response details, Error Response details, and a `curl` command example.
    *   Use code formatting and bolding for parameter/field names to improve readability. Ensure good spacing between documentation sections.
*   **Statistics Page:**
    *   Page Title: "Usage Statistics".
    *   Fetch pre-calculated statistics data from the corresponding API endpoint.
    *   Display loading/error/no data states appropriately.
    *   Display the following charts using a charting library (e.g., `recharts`):
        *   **Codes Generated (Daily):** A Bar Chart showing daily counts over time. Use fixed dimensions.
        *   **Top Companies:** A Pie Chart showing the distribution of codes generated by the top 10 companies. Use fixed dimensions and unique colors for each slice.
        *   **Popular Attributes:** Three separate vertical Bar Charts showing the top 10 most frequent Industries, Event Descriptions, and Discount Percentages. Use responsive containers with dynamic height.

**4. API Simulation (Development Only):**

*   Implement using **custom Vite plugin middleware**.
*   **Persistence:** Simulate data persistence by reading from and writing to a local `records.json` file. Handle file loading errors gracefully.
*   **Simulated Endpoints:**
    *   `GET /api/records`: Return all stored `ReferralRecord` objects.
    *   `POST /api/referrals`: Validate input, generate code/ID/timestamp/instructions (incorporating discount), store the new `ReferralRecord` (including all form fields) in memory and save to `records.json`, return success response.
    *   `POST /api/sendemail`: Accept payload, log a simulation message to the console, return success message.
    *   `GET /api/statistics`: Read the current records, calculate aggregate data (time series counts, top company counts, attribute popularity counts, total records), return `StatisticsResponse`.
    *   `GET /api/export/records`: Read current records, format as CSV (excluding `instructions`), set download headers, return CSV content.

**5. Data Structures (Types):**

Define clear TypeScript interfaces for the following data structures:

*   **`ReferralFormData`** (Data submitted from the form):
    *   `companyName`: `string` (Required)
    *   `industry?`: `string` (Optional)
    *   `contactName`: `string` (Required)
    *   `contactEmail`: `string` (Required)
    *   `contactPhone?`: `string` (Optional)
    *   `discountPercentage?`: `number` (Optional)
    *   `eventDescription?`: `string` (Optional)

*   **`ReferralRecord`** (Structure of a stored/retrieved record):
    *   `id`: `string` (Required, Unique identifier generated by the backend simulation)
    *   `createdAt`: `string` (Required, ISO 8601 timestamp string generated by the backend simulation)
    *   `referralCode`: `string` (Required, Generated code)
    *   `companyName`: `string` (Required)
    *   `industry?`: `string` (Optional)
    *   `contactName`: `string` (Required)
    *   `contactEmail`: `string` (Required)
    *   `contactPhone?`: `string` (Optional)
    *   `discountPercentage?`: `number` (Optional)
    *   `eventDescription?`: `string` (Optional)

*   **`ReferralSuccessResponse`** (Response on successful code generation):
    *   `referralCode`: `string`
    *   `instructions`: `string` (Dynamically generated instructions including discount)

*   **`ReferralErrorResponse`** (Common structure for API errors):
    *   `error`: `string` (Description of the error)

*   **`SendEmailPayload`** (Data sent to the email simulation endpoint):
    *   `referralCode`: `string` (Required)
    *   `instructions`: `string` (Required)
    *   `companyName`: `string` (Required)
    *   `emails`: `string[]` (Required, Array of email addresses)

*   **`SendEmailResponse`** (Response from the email simulation endpoint):
    *   `message`: `string` (Confirmation message)

*   **`ChartDataPoint`** (Generic structure for bar/pie chart data):
    *   `name`: `string` (Label for the data point, e.g., company name, industry)
    *   `count`: `number` (Value for the data point)

*   **`TimeSeriesData`** (Structure for time series counts):
    *   `Record<string, number>` (Object where keys are date/week/month strings and values are counts)

*   **`StatisticsResponse`** (Response from the statistics endpoint):
    *   `timeSeries`: `{ daily: TimeSeriesData; weekly: TimeSeriesData; monthly: TimeSeriesData; }`
    *   `topCompanies`: `ChartDataPoint[]` (Array of top 10 companies)
    *   `popularity`: `{ industries: ChartDataPoint[]; events: ChartDataPoint[]; discounts: ChartDataPoint[]; }` (Arrays for top 10 popular attributes)
    *   `totalRecords`: `number`

---
