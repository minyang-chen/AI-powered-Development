# Referral App Architecture (Updated)

This diagram shows the components and flow of the Referral Code Generator application, including the simulated backend via Vite middleware.

```mermaid
flowchart TD
    subgraph "User's Browser"
        direction LR
        User[User]
        ReactApp["React Frontend (Vite + TS)"]
        User <--> ReactApp
    end

    subgraph "React Frontend Components"
        direction TB
        App["App.tsx Router/Layout"] --> Page{Current Page View}

        Page -- Renders --> GenPage["GeneratorPage.tsx"]
        Page -- Renders --> RecView["RecordsView.tsx"]
        Page -- Renders --> ApiPage["ApiUsagePage.tsx"]
        Page -- Renders --> StatsPage["StatisticsPage.tsx"]

        GenPage --> Form["ReferralForm.tsx"]
        Form -- Uses --> ApiService["api.ts Service"]
        RecView -- Uses --> ApiService
        StatsPage -- Uses --> ApiService
    end

    subgraph "Vite Dev Server (Middleware Simulation)"
        direction TB
        Middleware["Custom Middleware (vite.config.ts)"]
        Middleware -- Reads/Writes --> RecordsFile["records.json"]

        Middleware -- Handles --> ApiRecords["GET /api/records"]
        Middleware -- Handles --> ApiReferrals["POST /api/referrals"]
        Middleware -- Handles --> ApiSendEmail["POST /api/sendemail"]
        Middleware -- Handles --> ApiStats["GET /api/statistics"]
        Middleware -- Handles --> ApiExport["GET /api/export/records"]

        ApiReferrals -- Modifies --> RecordsFile
        ApiRecords -- Reads --> RecordsFile
        ApiStats -- Reads --> RecordsFile
        ApiExport -- Reads --> RecordsFile
    end

    %% Interactions
    ApiService -- HTTP Request --> Middleware


    %% Styling
    classDef frontend fill:#lightblue,stroke:#333,stroke-width:2px;
    classDef backend fill:#lightgreen,stroke:#333,stroke-width:2px;
    classDef browser fill:#f9f,stroke:#333,stroke-width:2px;
    classDef file fill:#lightgrey,stroke:#333,stroke-width:1px;

    class ReactApp,App,Page,GenPage,RecView,ApiPage,StatsPage,Form,ApiService frontend;
    class Middleware,ApiRecords,ApiReferrals,ApiSendEmail,ApiStats,ApiExport backend;
    class RecordsFile file;
    class User browser;
```

**Explanation:**

1.  **User's Browser:** The user interacts with the React frontend.
2.  **React Frontend:** Built with Vite, React, and TypeScript.
    *   `App.tsx`: Handles routing and main layout (Title, Logo, Navigation).
    *   Renders different page components based on the route: `GeneratorPage`, `RecordsView`, `ApiUsagePage`, `StatisticsPage`.
    *   Page components use the `api.ts` service module to interact with the backend simulation.
    *   `ReferralForm.tsx` handles user input for generating codes.
3.  **Vite Dev Server (Middleware Simulation):**
    *   A custom Vite plugin injects middleware defined in `vite.config.ts`.
    *   This middleware intercepts requests to specific `/api/*` paths.
    *   It handles GET and POST requests for records, referrals, email simulation, statistics calculation, and CSV export.
    *   It reads from and writes to `records.json` to persist data during development.

**Flow:**

*   The user navigates the React app via links handled by `App.tsx`.
*   Frontend components (via `api.ts`) make HTTP requests (GET/POST) to paths like `/api/records`, `/api/referrals`, etc.
*   The custom middleware in `vite.config.ts` intercepts these requests.
*   The middleware performs the necessary actions (reading/writing `records.json`, calculating stats, formatting CSV) and sends back the appropriate JSON or CSV response.