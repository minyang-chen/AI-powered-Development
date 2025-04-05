# Referral App Architecture

This diagram shows the basic components and flow of the Referral Code Generator application.

```mermaid
graph TD
    subgraph "User's Browser"
        direction LR
        User[User]
        ReactApp[React Frontend (Vite + TS)]
        User <--> ReactApp
    end

    subgraph "React Frontend Components"
        App[App.tsx Router/Layout] --> Page{Current Page View}
        Page -- Renders --> GenPage[GeneratorPage.tsx]
        Page -- Renders --> RecView[RecordsView.tsx]
        GenPage --> Form[ReferralForm.tsx]
        Form -- Uses --> ApiService[api.ts Service]
    end

    subgraph "Backend (Conceptual)"
        direction TB
        APIServer[API Server (External)]
        Database[(Referral Data Store)]
        APIServer --> Database
    end

    %% Interactions
    ApiService -- HTTP POST Request --> APIServer
    RecView -- HTTP GET Request --> APIServer


    %% Styling
    classDef frontend fill:#lightblue,stroke:#333,stroke-width:2px;
    classDef backend fill:#lightgreen,stroke:#333,stroke-width:2px;
    classDef browser fill:#f9f,stroke:#333,stroke-width:2px;

    class ReactApp,App,Page,GenPage,RecView,Form,ApiService frontend;
    class APIServer,Database backend;
    class User,UserBrowser browser;

```

**Explanation:**

1.  **User's Browser:** The user interacts with the application through their web browser.
2.  **React Frontend:** Built with Vite, React, and TypeScript.
    *   `App.tsx`: Handles routing between pages and the main layout (including navigation).
    *   `GeneratorPage.tsx`: The page component that renders the referral form.
    *   `ReferralForm.tsx`: The component containing the input fields, validation logic (`react-hook-form`), and submission handling.
    *   `RecordsView.tsx`: A component (assumed) to display previously generated referral records.
    *   `api.ts`: A service module responsible for making HTTP requests to the backend API.
3.  **Backend (Conceptual):** Represents the server-side logic (not part of this frontend project).
    *   `API Server`: An external API endpoint that receives form data, generates referral codes, stores data, and retrieves records.
    *   `Referral Data Store`: A database or other storage mechanism where referral information is kept.

**Flow:**

*   The user navigates the React app.
*   On the Generator Page, the user fills the `ReferralForm`.
*   Upon submission, the `ReferralForm` uses the `api.ts` service to send the data via an HTTP POST request to the `API Server`.
*   The `API Server` processes the request, potentially interacts with the `Database`, and returns a response (e.g., the generated code or an error).
*   The `RecordsView` component (when navigated to) would use the `api.ts` service to send an HTTP GET request to retrieve records from the `API Server`.