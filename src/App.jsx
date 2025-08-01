import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LondingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import InterviewSessionPage from './pages/InterviewSessionPage';
import FeedbackPage from './pages/FeedbackPage';
import CommunicationPracticePage from './pages/CommunicationPracticePage';

// A wrapper for routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useAuth();
  return isSignedIn ? children : <Navigate to="/auth" replace />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'new-session',
        element: <ServiceSelectionPage />,
      },
      {
        path: 'practice',
        element: <InterviewSessionPage />,
      },
      {
        path: 'communication-practice',
        element: <CommunicationPracticePage />,
      },
      {
        path: 'feedback/:sessionId',
        element: <FeedbackPage />,
      },
    ],
  },
  // Redirect any unknown paths to the landing page
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;