import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import Button  from '../common/Button';
import { MicIcon, LogOutIcon } from '../icons/index';
import { useAuth } from '../../hooks/useAuth';

const AppLayout = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/app/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <MicIcon className="h-6 w-6 text-blue-500" />
            <span>VoiceCoach</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOutIcon className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>
      </header>
      <main className="p-4 sm:p-8">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default AppLayout;