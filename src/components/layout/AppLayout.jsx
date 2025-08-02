import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Mic } from 'lucide-react'; // Using lucide-react for consistency

const AppLayout = () => {
  // The useAuth hook and handleLogout function are no longer needed.
  // Clerk's <UserButton /> handles all of that automatically.

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/app/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Mic className="h-6 w-6 text-blue-500" />
            <span>VoiceCoach</span>
          </Link>
          
          {/* This is Clerk's UserButton component. 
            It automatically displays the user's profile picture or initials.
            Clicking it opens a menu to "Manage account" or "Sign out".
            The afterSignOutUrl prop tells Clerk where to redirect the user after they sign out.
          */}
          <UserButton afterSignOutUrl="/" />

        </div>
      </header>
      <main className="p-4 sm:p-8">
        {/* Child routes from your router will be rendered here */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AppLayout;
