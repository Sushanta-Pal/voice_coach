import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';

import { SessionProvider } from './providers/SessionProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import App from './App';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key.");
}

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* REMOVED: The <BrowserRouter> wrapper is gone. */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ThemeProvider>
            <App /> {/* App now provides the router itself */}
          </ThemeProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);
