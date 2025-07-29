import React, { useState } from 'react';

// --- Mock shadcn/ui components ---
// In a real project, you would import these from your library, e.g., '@/components/ui/button'
// For this example, we'll define them as styled React components.

const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
  };
  return <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-500 ${className}`}
    {...props}
  />
);

const Label = ({ className = '', ...props }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />
);

const Card = ({ children, className = '' }) => <div className={`rounded-xl border bg-white text-slate-900 shadow dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardFooter = ({ children, className = '' }) => <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>;

const Tabs = ({ children, defaultValue, onValueChange, className = '' }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    
    const handleTabChange = (value) => {
        setActiveTab(value);
        if (onValueChange) {
            onValueChange(value);
        }
    };

    return (
        <div className={className}>
            {React.Children.map(children, child => {
                if (!child) return null;
                if (child.type === TabsList) {
                    return React.cloneElement(child, { activeTab, onTabChange: handleTabChange });
                }
                if (child.type === TabsContent && child.props.value === activeTab) {
                    return child;
                }
                return null;
            })}
        </div>
    );
};
const TabsList = ({ children, activeTab, onTabChange, className = '' }) => <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}>{React.Children.map(children, child => React.cloneElement(child, { activeTab, onTabChange }))}</div>;
const TabsTrigger = ({ children, value, activeTab, onTabChange, className = '' }) => <button onClick={() => onTabChange(value)} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === value ? 'bg-white shadow-sm text-slate-950 dark:bg-slate-950 dark:text-slate-50' : ''} ${className}`}>{children}</button>;
const TabsContent = ({ children, value, className = '' }) => <div className={`mt-4 ${className}`}>{children}</div>;

// --- Main Auth Component ---

function AuthComponent() {
  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center">
           <CardTitle>Welcome</CardTitle>
           <CardDescription>Sign in or create an account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="sign-in">
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email-in">Email</Label>
                  <Input type="email" id="email-in" placeholder="m@example.com" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password-in">Password</Label>
                  <Input type="password" id="password-in" placeholder="••••••••" />
                </div>
                <Button className="w-full">Sign In</Button>
              </div>
            </TabsContent>

            <TabsContent value="sign-up">
              <div className="space-y-4">
                 <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name-up">Name</Label>
                  <Input type="text" id="name-up" placeholder="Max Robinson" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email-up">Email</Label>
                  <Input type="email" id="email-up" placeholder="m@example.com" />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="password-up">Password</Label>
                  <Input type="password" id="password-up" placeholder="••••••••" />
                </div>
                <Button className="w-full">Create Account</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.3 1.84-4.32 1.84-5.24 0-9.5-4.26-9.5-9.5s4.26-9.5 9.5-9.5c3.03 0 5.08 1.24 6.24 2.36l-2.62 2.62c-.8- .76-1.96-1.24-3.62-1.24-4.22 0-7.64 3.42-7.64 7.64s3.42 7.64 7.64 7.64c2.44 0 3.86-1.02 4.92-2.08 1.24-1.24 1.82-2.98 2-5.04h-7.02z"></path></svg>
                  Google
              </Button>
              <Button variant="outline">
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                  GitHub
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthComponent;
