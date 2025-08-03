import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Mic } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"; // Import framer-motion

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2 font-bold text-lg"
          >
            <Mic className="h-6 w-6 text-blue-500" />
            <span>VoiceCoach</span>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      <main className="p-4 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;
