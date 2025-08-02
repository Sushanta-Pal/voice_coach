import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
// In App.jsx
import { SignedIn, SignedOut, SignIn, SignUp, useUser, RedirectToSignIn } from '@clerk/clerk-react';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LondingPage';
import DashboardPage from './pages/DashboardPage';
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import InterviewSessionPage from './pages/InterviewSessionPage';
import FeedbackPage from './pages/FeedbackPage';
import CommunicationPracticePage from './pages/CommunicationPracticePage';

/**
 * A wrapper for routes that require authentication.
 * It checks if a user is signed in with Clerk.
 * If not, it redirects them to the sign-in page.
 * It also handles the initial loading state.
 */
// In App.jsx
// In App.jsx

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
const router = createBrowserRouter([
  // In App.jsx
{
  path: '/',
  element: (
    <>
      <SignedIn>
        {/* If the user is signed in, redirect them to the dashboard */}
        <Navigate to="/app/dashboard" replace />
      </SignedIn>
      <SignedOut>
        {/* If the user is signed out, show the landing page */}
        <LandingPage />
      </SignedOut>
    </>
  ),
},
  {
    // Clerk's sign-in page
    path: '/sign-in',
    element: <SignIn routing="path" path="/sign-in" afterSignInUrl="/app/dashboard" />,
  },
  {
    // Clerk's sign-up page
    path: '/sign-up',
    element: <SignUp routing="path" path="/sign-up" afterSignUpUrl="/app/dashboard" />,
  },
  {
    // Protected application routes
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'new-session', element: <ServiceSelectionPage /> },
      { path: 'practice', element: <InterviewSessionPage /> },
      { path: 'communication-practice', element: <CommunicationPracticePage /> },
      { path: 'feedback/:sessionId', element: <FeedbackPage /> },
      // Redirect from /app to /app/dashboard
      { path: '', element: <Navigate to="dashboard" replace /> }
    ],
  },
  {
    // Redirect any unknown paths
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
