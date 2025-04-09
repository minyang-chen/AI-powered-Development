# Login Feature Implementation Plan (Simple Local Storage)

## Overview

Implement a simple username/password login system using browser local storage, protecting the entire application, and including a basic registration page.

**Security Note:** Storing passwords directly in local storage is **highly insecure** for any real-world application. This plan follows the user's request for a *simple* implementation using local storage but should be replaced with a proper backend authentication system for production use.

## Implementation Steps

1.  **Install Dependencies:**
    *   Install `react-router-dom` for handling routing: `npm install react-router-dom`

2.  **Create Authentication Components:**
    *   **`src/pages/LoginPage.jsx`**:
        *   Form with "Username" and "Password" inputs.
        *   "Login" button.
        *   Link/button to registration page (`/register`).
        *   Logic: On submit, check credentials against `localStorage`, set login status flag (`isLoggedIn`, `loggedInUser`) in `localStorage`, redirect to `/` on success, show error on failure.
    *   **`src/pages/RegisterPage.jsx`**:
        *   Form with "Username", "Password", "Confirm Password" inputs.
        *   "Register" button.
        *   Link/button back to login page (`/login`).
        *   Logic: On submit, validate input (password match, non-empty), check username uniqueness in `localStorage`. If valid/unique, store username/password (insecurely) in `localStorage` (e.g., under `app_users` key). Redirect to `/login` on success, show error on failure.
    *   **`src/layouts/AuthLayout.jsx`**:
        *   Wrapper component for the main `App`.
        *   Checks `localStorage` for `isLoggedIn` flag on mount.
        *   Renders children (`App`) if logged in.
        *   Redirects to `/login` if not logged in.
    *   **Logout Button:**
        *   Add to `App` component UI (e.g., `Sidebar`).
        *   On click: remove `isLoggedIn` and `loggedInUser` from `localStorage`, redirect to `/login`.

3.  **Set Up Routing:**
    *   Modify `src/main.jsx` (or create `src/Router.jsx`).
    *   Use `BrowserRouter` from `react-router-dom`.
    *   Define routes:
        *   `/login`: Renders `<LoginPage />`.
        *   `/register`: Renders `<RegisterPage />`.
        *   `/`: Renders `<AuthLayout><App /></AuthLayout>`.

4.  **Local Storage Structure (Example):**
    *   `app_users`: JSON string mapping usernames to passwords (e.g., `'{ "user1": "pass1", "user2": "pass2" }'`).
    *   `isLoggedIn`: Boolean flag (e.g., `'true'`).
    *   `loggedInUser`: Username string (e.g., `'user1'`).

## Conceptual Flow Diagram

```mermaid
graph TD
    subgraph User Interaction
        A[User visits site] --> B{Check localStorage for 'isLoggedIn'}
        B -- Logged In --> C[Render App via AuthLayout]
        B -- Not Logged In --> D[Redirect to /login]
        D --> E[Show LoginPage]
        E -- Enters Credentials & Clicks Login --> F{Verify Credentials against localStorage}
        F -- Valid --> G[Set 'isLoggedIn' in localStorage] --> H[Redirect to /] --> C
        F -- Invalid --> I[Show Login Error] --> E
        E -- Clicks 'Register' Link --> J[Redirect to /register]
        J --> K[Show RegisterPage]
        K -- Enters Details & Clicks Register --> L{Validate Input & Check Uniqueness in localStorage}
        L -- Valid & Unique --> M[Add User to localStorage] --> N[Redirect to /login] --> E
        L -- Invalid/Exists --> O[Show Registration Error] --> K
        C -- Clicks Logout Button --> P[Remove 'isLoggedIn' from localStorage] --> Q[Redirect to /login] --> E
    end

    subgraph Local Storage
        LS1[app_users: {username: password, ...}]
        LS2[isLoggedIn: 'true'/'false' or null]
        LS3[loggedInUser: username or null]
    end

    F --> LS1;
    L --> LS1;
    M --> LS1;
    B --> LS2;
    G --> LS2;
    P --> LS2;
    G --> LS3;
    P --> LS3;

    style D fill:#f9f,stroke:#333,stroke-width:2px
    style J fill:#f9f,stroke:#333,stroke-width:2px
    style N fill:#f9f,stroke:#333,stroke-width:2px
    style Q fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#ccf,stroke:#333,stroke-width:2px
```

## Proposed File Structure Changes

```
src/
├── App.jsx
├── main.jsx
├── components/
│   ├── ... (existing components)
├── layouts/            # New directory
│   └── AuthLayout.jsx  # New file
├── pages/              # New directory
│   ├── LoginPage.jsx     # New file
│   └── RegisterPage.jsx  # New file
├── utils/
│   └── codeGenerator.js
# Potentially add an auth utility file later if logic gets complex
# src/utils/auth.js