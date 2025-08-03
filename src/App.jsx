import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Import Layouts
import AppLayout from "./components/layout/AppLayout";

// Import Pages
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ServiceSelectionPage from "./pages/ServiceSelectionPage";
import InterviewSessionPage from "./pages/InterviewSessionPage";
import FeedbackPage from "./pages/FeedbackPage";
import CommunicationPracticePage from "./pages/CommunicationPracticePage";

/**
 * @name ProtectedRoute
 * @description A component that wraps protected routes.
 * It uses Clerk's <SignedIn> and <SignedOut> components to manage access.
 * If the user is signed in, it renders the main application layout.
 * If not, it redirects them to the sign-in page.
 */
const ProtectedRoute = () => {
  return (
    <>
      <SignedIn>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

/**
 * @name router
 * @description The main router configuration for the application using createBrowserRouter.
 */
const router = createBrowserRouter([
  // --- Public Routes ---
  {
    // The root path of the application.
    // It conditionally renders based on the user's authentication state.
    path: "/",
    element: (
      <>
        <SignedIn>
          {/* If the user is signed in, immediately redirect them to their dashboard. */}
          <Navigate to="/app/dashboard" replace />
        </SignedIn>
        <SignedOut>
          {/* If the user is signed out, show the public landing page. */}
          <LandingPage />
        </SignedOut>
      </>
    ),
  },

  // --- Protected Application Routes ---
  {
    // This is the main entry point for the authenticated part of the app.
    path: "/app",
    element: <ProtectedRoute />, // This route and all its children are protected.
    children: [
      {
        // The main dashboard page.
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        // Page to select a new practice session type.
        path: "new-session",
        element: <ServiceSelectionPage />,
      },
      {
        // The practice page for Technical/HR interviews.
        path: "practice",
        element: <InterviewSessionPage />,
      },
      {
        // The practice page for communication skills.
        path: "communication-practice",
        element: <CommunicationPracticePage />,
      },
      {
        // The feedback page, which takes a dynamic session ID.
        path: "feedback/:sessionId",
        element: <FeedbackPage />,
      },
      {
        // If a user navigates to just "/app", redirect them to the dashboard.
        path: "",
        element: <Navigate to="dashboard" replace />,
      },
    ],
  },

  // --- Catch-all Route ---
  {
    // This will match any path that hasn't been matched by the routes above.
    // It redirects any unknown URL back to the root, preventing 404 errors.
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

/**
 * @name App
 * @description The root component of the application which provides the router.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
