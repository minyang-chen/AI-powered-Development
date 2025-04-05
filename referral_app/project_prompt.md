
**Prompt for Frontend Development Task:**

**Objective:** Implement the frontend for a Referral Code Generation web application using React and TypeScript.

**Core Requirements:**

1.  **Referral Registration Page:**
    *   Create a single-page React application.
    *   Implement a form component (`ReferralForm.tsx`).
    *   The form should collect the following user information:
        *   Company Name (text input, required)
        *   Industry (dropdown/select, optional - provide a few sample options like 'Technology', 'Finance', 'Retail', 'Other')
        *   Contact Name (text input, required)
        *   Contact Email (email input, required, basic format validation desirable)
        *   Contact Phone (tel input, optional)
    *   Include a "Submit" button.

2.  **Form Submission & API Interaction:**
    *   On form submission:
        *   Perform basic client-side validation to ensure required fields are filled.
        *   If valid, send the form data as a JSON payload via a POST request to a placeholder backend endpoint: `/api/referrals`.
        *   **Request Body Example:**
            ```json
            {
              "companyName": "Example Corp",
              "industry": "Technology",
              "contactName": "Jane Doe",
              "contactEmail": "jane.doe@example.com",
              "contactPhone": "123-456-7890"
            }
            ```
    *   **Backend Interaction (Simulated):** Assume the backend (`/api/referrals`) will:
        *   Return a `200 OK` status with a JSON body upon successful validation and code generation.
            *   **Success Response Example:**
                ```json
                {
                  "referralCode": "REF-XYZ123ABC",
                  "instructions": "Share this code with new subscribers. They will receive a 10% discount on their first month when using this code during signup."
                }
                ```
        *   Return a non-200 status (e.g., `400 Bad Request`) with an error message if validation fails or another issue occurs.
            *   **Error Response Example:**
                ```json
                {
                  "error": "Invalid email format."
                }
                ```

3.  **Display Results:**
    *   After a successful submission (200 OK response):
        *   Hide or clear the form.
        *   Display the received `referralCode` and `instructions` clearly to the user.
    *   If an error occurs during submission (non-200 response):
        *   Display the error message received from the backend near the form or submit button.
        *   Keep the form populated so the user can correct errors.

**Technology Stack:**

*   **Framework/Library:** React (v18+)
*   **Language:** TypeScript
*   **Build Tool/Environment:** Vite
*   **Form Management:** React Hook Form
*   **API Client:** Axios or native `fetch`
*   **UI Styling:** Use Tailwind CSS for styling components. Ensure a clean, professional look and basic responsiveness.
*   **(Optional) State Management:** Use Zustand if global state becomes necessary beyond form state, otherwise component state is sufficient.
*   **(Optional) Routing:** Use React Router if you foresee needing multiple pages later, but for now, a single page in `App.tsx` is acceptable.

**Project Structure:**
*   Create a folder name "referral_app" for the project
*   Organize code logically within the `src` directory. Suggested structure:
    *   `src/App.tsx` (Main application component, routing if used)
    *   `src/components/ReferralForm.tsx` (The main form component)
    *   `src/services/api.ts` (Function(s) for interacting with the backend API)
    *   `src/types/index.ts` (TypeScript type definitions, e.g., for form data, API responses)

**Quality Attributes:**

*   Write clean, readable, and well-commented TypeScript code.
*   Implement basic error handling for the API request (e.g., network errors, backend errors).
*   Ensure required form fields have appropriate validation messages.

**Exclusions:**

*   Do not implement the backend API logic (`/api/referrals`). Assume it exists and behaves as described.
*   No user authentication or session management is required for this task.
*   The advanced visual workflow features (canvas, drag/drop) are **not** part of this task.

**Deliverable:** A functional React/TypeScript frontend application fulfilling the requirements above, ready to interact with the specified (placeholder) backend endpoint.

