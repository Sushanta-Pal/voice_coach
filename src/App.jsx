import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { SignedIn, SignedOut, SignIn, SignUp, useUser } from '@clerk/clerk-react';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LondingPage';
import DashboardPage from './pages/DashboardPage';
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import InterviewSessionPage from './pages/InterviewSessionPage';
import FeedbackPage from './pages/FeedbackPage';
import CommunicationPracticePage from './pages/CommunicationPracticePage';
import LoadingSpinner from './components/common/LoadingSpinner';

/**
 * A wrapper for routes that require authentication.
 * It checks if a user is signed in with Clerk.
 * If not, it redirects them to the sign-in page.
 * It also handles the initial loading state.
 */
const ProtectedRoute = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    // Show a loading spinner while Clerk is checking the user's session.
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isSignedIn) {
    // If the user is not signed in, redirect them to the sign-in page.
    return <Navigate to="/sign-in" replace />;
  }

  // If the user is signed in, render the nested routes inside the AppLayout.
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

const router = createBrowserRouter([
  {
    // Public landing page
    path: '/',
    element: (
      <SignedOut>
        <LandingPage />
      </SignedOut>
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
