import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Import reusable UI components
import  Button  from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { Input, Label } from '../components/common/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/common/Tabs';
import { MicIcon } from '../components/icons/index';

/**
 * Authentication page for user sign-in and sign-up.
 */
function AuthPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  /**
   * Handles the authentication logic for both sign-in and sign-up.
   * On success, it updates the auth state and navigates to the dashboard.
   * @param {React.FormEvent} e - The form event.
   */
  const handleAuth = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // In a real app, you would have validation and an API call here.
    // For this demo, we'll just simulate a successful login.
    signIn();
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* App Logo and Link to Landing Page */}
      <Link to="/" className="flex items-center gap-2 font-bold text-lg cursor-pointer mb-8 text-slate-900 dark:text-slate-50">
        <MicIcon className="h-6 w-6 text-blue-500" />
        <span>VoiceCoach</span>
      </Link>

      {/* Auth Card */}
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="sign-in" className="w-full">
            {/* Tab Triggers */}
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent value="sign-in">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email-in">Email</Label>
                  <Input type="email" id="email-in" placeholder="m@example.com" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password-in">Password</Label>
                  <Input type="password" id="password-in" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="sign-up">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name-up">Name</Label>
                  <Input type="text" id="name-up" placeholder="Max Robinson" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email-up">Email</Label>
                  <Input type="email" id="email-up" placeholder="m@example.com" required />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password-up">Password</Label>
                  <Input type="password" id="password-up" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthPage;
