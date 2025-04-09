# Landing Page Implementation Plan

## Overview

Add a public landing page to the application, serving as the main entry point (`/`). This page will provide information about the application and links to log in or register. The main application itself will be moved to a protected route (`/app`).

## Implementation Steps

1.  **Create Landing Page Component (`src/pages/LandingPage.jsx`):**
    *   This component will be the public homepage.
    *   **Structure:**
        *   **Hero Section:**
            *   Main Headline (e.g., "Build Workflows Visually")
            *   Sub-headline/Tagline
            *   Primary Call-to-Action (CTA) Buttons:
                *   "Login" (links to `/login`)
                *   "Register" / "Sign Up" (links to `/register`)
        *   **Features Section:**
            *   Sub-heading (e.g., "Key Features")
            *   Placeholders for 2-3 feature descriptions (e.g., "Intuitive drag-and-drop", "Generate Python code", "Customizable nodes").
        *   **Footer:**
            *   Copyright notice (e.g., "© 2025 Your App Name")
            *   Optional placeholder links (Terms, Privacy).

2.  **Update Routing (`src/main.jsx`):**
    *   Modify the `Routes` configuration:
        *   Change the existing route for `/` to render `<LandingPage />`. Ensure this route is *not* wrapped by `AuthLayout`.
        *   Create a new route for `/app`. This route will render the protected application: `<AuthLayout><ReactFlowProvider><App /></ReactFlowProvider></AuthLayout>`.

3.  **Adjust Redirects:**
    *   **Login Success:** In `src/pages/LoginPage.jsx`, change the `navigate('/')` call within the successful login logic to `navigate('/app')`.
    *   **Logout:** In `src/App.jsx`, change the `navigate('/login')` call within the `handleLogout` function to `navigate('/')`.

## Conceptual Flow Change

```mermaid
graph TD
    subgraph User Interaction
        A[User visits site (/)] --> LP[Show LandingPage]
        LP -- Clicks Login --> LoginPg[Redirect to /login]
        LP -- Clicks Register --> RegPg[Redirect to /register]

        LoginPg -- Enters Credentials & Clicks Login --> Verify{Verify Credentials}
        Verify -- Valid --> SetLogin[Set 'isLoggedIn'] --> AppRedirect[Redirect to /app] --> ShowApp[Render App via AuthLayout]
        Verify -- Invalid --> LoginErr[Show Login Error] --> LoginPg

        RegPg -- Enters Details & Clicks Register --> ValidateReg{Validate Input & Check Uniqueness}
        ValidateReg -- Valid & Unique --> AddUser[Add User to localStorage] --> LoginRedirect[Redirect to /login] --> LoginPg
        ValidateReg -- Invalid/Exists --> RegErr[Show Registration Error] --> RegPg

        ShowApp -- Clicks Logout Button --> ClearLogin[Remove 'isLoggedIn'] --> LandingRedirect[Redirect to /] --> LP
    end

    subgraph Routing
        R1["/"] --> LPComp[LandingPage Component]
        R2["/login"] --> LoginComp[LoginPage Component]
        R3["/register"] --> RegComp[RegisterPage Component]
        R4["/app"] --> AuthComp[AuthLayout Component] --> RFWComp[ReactFlowProvider Component] --> AppComp[App Component]
    end

    style AppRedirect fill:#ccf,stroke:#333,stroke-width:2px
    style LandingRedirect fill:#f9f,stroke:#333,stroke-width:2px
```

## Summary of Changes

*   New `src/pages/LandingPage.jsx` file with Hero, Features, and Footer sections.
*   Modified routing in `src/main.jsx` to serve `LandingPage` at `/` and the main app at `/app`.
*   Updated login success redirect in `src/pages/LoginPage.jsx` to point to `/app`.
*   Updated logout redirect in `src/App.jsx` to point to `/`.