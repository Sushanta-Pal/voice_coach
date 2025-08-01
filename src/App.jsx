import React, { useState, useEffect, useRef } from 'react';

// --- Icon Components ---
const MicIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>);
const TypeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M12 18v-7"/><path d="M9 11h6"/></svg>);
const UsersIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
const BarChartIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>);
const MenuIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>);
const XIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>);
const LogOutIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const CodeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const TieIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-4-4-4-8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9c0 4-4 8-4 8z"/><path d="M12 7v15"/><path d="m9 7 3-4 3 4"/></svg>);
const GlobeIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>);
const CheckCircleIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const AlertCircleIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const SparklesIcon = (props) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 18l1.9-5.8 5.8-1.9-5.8-1.9z"/></svg>);


// --- Mock shadcn/ui & recharts Components ---
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => { const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300"; const variants = { default: "bg-blue-600 text-slate-50 hover:bg-blue-600/90 dark:bg-blue-500 dark:text-slate-50 dark:hover:bg-blue-500/90", outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50", ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50", destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90", }; const sizes = { default: "h-10 px-4 py-2", lg: "h-11 rounded-md px-8 text-base", sm: "h-9 rounded-md px-3" }; return <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>; };
const Card = ({ children, className = '' }) => <div className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Input = ({ className = '', ...props }) => (<input className={`flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-500 ${className}`} {...props} />);
const Label = ({ className = '', ...props }) => (<label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />);
const Textarea = ({ className = '', ...props }) => (<textarea className={`flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-300 ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />);
const Tabs = ({ children, defaultValue, onValueChange, className = '' }) => { const [activeTab, setActiveTab] = useState(defaultValue); const handleTabChange = (value) => { setActiveTab(value); if (onValueChange) onValueChange(value); }; return (<div className={className}>{React.Children.map(children, child => { if (!child) return null; if (child.type === TabsList) { return React.cloneElement(child, { activeTab, onTabChange: handleTabChange }); } if (child.type === TabsContent && child.props.value === activeTab) { return child; } return null; })}</div>); };
const TabsList = ({ children, activeTab, onTabChange, className = '' }) => <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}>{React.Children.map(children, child => React.cloneElement(child, { activeTab, onTabChange }))}</div>;
const TabsTrigger = ({ children, value, activeTab, onTabChange, className = '' }) => <button onClick={() => onTabChange(value)} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === value ? 'bg-white shadow-sm text-slate-950 dark:bg-slate-950 dark:text-slate-50' : ''} ${className}`}>{children}</button>;
const TabsContent = ({ children, value, className = '' }) => <div className={`mt-4 ${className}`}>{children}</div>;
const ResponsiveContainer = ({ children }) => <div style={{ width: '100%', height: '100%' }}>{children}</div>;
const LineChart = ({ children, data }) => <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 flex items-end"><div className="w-full h-full border-l-2 border-b-2 border-slate-300 dark:border-slate-600 relative"><svg className="absolute inset-0" width="100%" height="100%" preserveAspectRatio="none"><polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.score}`).join(' ')} vectorEffect="non-scaling-stroke" /></svg></div></div>;
const XAxis = () => null; const YAxis = () => null; const CartesianGrid = () => null; const Tooltip = () => null; const Legend = () => null; const Line = () => null;

// --- Reusable Modal Component ---
const Modal = ({ title, content, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <Card className="border-0">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2"><SparklesIcon className="text-blue-500" /> {title}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}><XIcon className="h-4 w-4" /></Button>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        {content ? <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} /> : <p>Generating...</p>}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
// --- Page Components ---

function Navbar({ navigate, isSignedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80' : 'bg-transparent'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href="#" onClick={() => navigate({page: 'landing'})} className="flex items-center gap-2 font-bold text-lg cursor-pointer">
          <MicIcon className="h-6 w-6 text-blue-500" />
          <span>VoiceCoach</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">Features</a>
          <a href="#testimonials" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">Testimonials</a>
          <a href="#" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">Pricing</a>
        </nav>
        <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate({page: 'auth'})}>Sign In</Button>
            <Button onClick={() => navigate({page: isSignedIn ? 'dashboard' : 'auth'})}>
              {isSignedIn ? 'Dashboard' : 'Start Free Trial'}
            </Button>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 p-6 border-t">
          <nav className="flex flex-col gap-4 text-lg">
            <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#testimonials" onClick={() => setIsOpen(false)}>Testimonials</a>
            <a href="#" onClick={() => setIsOpen(false)}>Pricing</a>
            <div className="flex flex-col gap-4 mt-4">
                <Button variant="outline" onClick={() => { navigate({page: 'auth'}); setIsOpen(false); }}>Sign In</Button>
                <Button onClick={() => { navigate({page: isSignedIn ? 'dashboard' : 'auth'}); setIsOpen(false); }}>
                  {isSignedIn ? 'Dashboard' : 'Start Free Trial'}
                </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeroSection({ navigate, isSignedIn }) {
    return (
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text">
                        Ace Your Next Interview with AI
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8">
                        VoiceCoach analyzes your speech, prepares you for technical & HR rounds, and gives you the confidence to land your dream job.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" onClick={() => navigate({page: isSignedIn ? 'dashboard' : 'auth'})}>Start Practicing Now</Button>
                        <Button size="lg" variant="outline">Watch a Demo</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    const features = [
        { icon: <MicIcon className="h-8 w-8 text-blue-500" />, title: "Real-time Speech Analysis", description: "Get instant feedback on your pacing, filler words, and clarity to sound more confident and professional." },
        { icon: <UsersIcon className="h-8 w-8 text-blue-500" />, title: "Unlimited Mock Interviews", description: "Practice with AI interviewers for various roles, from HR questions to complex technical challenges." },
        { icon: <BarChartIcon className="h-8 w-8 text-blue-500" />, title: "Personalized Dashboard", description: "Track your progress over time with detailed analytics and identify key areas for improvement." },
    ];
    return (
        <section id="features" className="w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal Interview Toolkit</h2><p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Everything you need to go from nervous to prepared.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{features.map((feature) => (<Card key={feature.title} className="text-center flex flex-col items-center p-4"><CardHeader><div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">{feature.icon}</div><CardTitle>{feature.title}</CardTitle></CardHeader><CardContent><CardDescription>{feature.description}</CardDescription></CardContent></Card>))}</div>
            </div>
        </section>
    );
}

function TestimonialSection() {
    const testimonials = [
        { name: "Sarah L.", role: "Software Engineer @ Google", quote: "VoiceCoach was a game-changer. The AI feedback on my technical explanations helped me nail the final round." },
        { name: "Michael B.", role: "Product Manager @ Stripe", quote: "I used to ramble and use so many filler words. The dashboard showed me exactly where to improve. I felt so much more confident." },
        { name: "Jessica Y.", role: "UX Designer @ Airbnb", quote: "The mock interviews are incredibly realistic. It's like having a hiring manager on call 24/7. 10/10 would recommend." },
    ];
    return (
        <section id="testimonials" className="w-full py-20 md:py-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16"><h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trusted by Professionals at Top Companies</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{testimonials.map(t => (<Card key={t.name}><CardContent className="pt-6"><p className="italic">"{t.quote}"</p></CardContent><CardHeader><CardTitle>{t.name}</CardTitle><CardDescription>{t.role}</CardDescription></CardHeader></Card>))}</div>
            </div>
        </section>
    );
}


function LandingPage({ navigate, isSignedIn }) {
  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar navigate={navigate} isSignedIn={isSignedIn} />
      <main>
        <HeroSection navigate={navigate} isSignedIn={isSignedIn} />
        <FeaturesSection />
        <TestimonialSection />
      </main>
      <footer className="w-full py-12 bg-slate-100 dark:bg-slate-900"><div className="container mx-auto px-4 md:px-6 text-center text-slate-500 dark:text-slate-400"><p>&copy; 2025 VoiceCoach. All rights reserved.</p></div></footer>
    </div>
  );
}

function AuthComponent({ navigate, setIsSignedIn }) { const handleAuth = () => { setIsSignedIn(true); navigate({ page: 'dashboard' }); }; return (<div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4"><a href="#" onClick={() => navigate({ page: 'landing' })} className="flex items-center gap-2 font-bold text-lg cursor-pointer mb-8"><MicIcon className="h-6 w-6 text-blue-500" /><span>VoiceCoach</span></a><Card className="w-full max-w-[400px]"><CardHeader className="text-center"><CardTitle>Get Started</CardTitle><CardDescription>Sign in or create an account to continue</CardDescription></CardHeader><CardContent className="p-4 sm:p-6"><Tabs defaultValue="sign-in" className="w-full"><TabsList className="grid w-full grid-cols-2 mb-6"><TabsTrigger value="sign-in">Sign In</TabsTrigger><TabsTrigger value="sign-up">Sign Up</TabsTrigger></TabsList><TabsContent value="sign-in"><div className="space-y-4"><div className="grid w-full items-center gap-1.5"><Label htmlFor="email-in">Email</Label><Input type="email" id="email-in" placeholder="m@example.com" /></div><div className="grid w-full items-center gap-1.5"><Label htmlFor="password-in">Password</Label><Input type="password" id="password-in" placeholder="••••••••" /></div><Button className="w-full" onClick={handleAuth}>Sign In</Button></div></TabsContent><TabsContent value="sign-up"><div className="space-y-4"><div className="grid w-full items-center gap-1.5"><Label htmlFor="name-up">Name</Label><Input type="text" id="name-up" placeholder="Max Robinson" /></div><div className="grid w-full items-center gap-1.5"><Label htmlFor="email-up">Email</Label><Input type="email" id="email-up" placeholder="m@example.com" /></div><div className="grid w-full items-center gap-1.5"><Label htmlFor="password-up">Password</Label><Input type="password" id="password-up" placeholder="••••••••" /></div><Button className="w-full" onClick={handleAuth}>Create Account</Button></div></TabsContent></Tabs></CardContent></Card></div>); }

function DashboardPage({ navigate, sessionHistory, setIsSignedIn }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    const totalSessions = sessionHistory.length;
    const avgScore = totalSessions > 0
        ? (sessionHistory.reduce((acc, s) => acc + s.score, 0) / totalSessions).toFixed(0)
        : 0;

    const handleLogout = () => {
        setIsSignedIn(false);
        navigate({ page: 'landing' });
    };

    const handleSummarizeProgress = async () => {
        setIsModalOpen(true);
        setIsSummaryLoading(true);
        const historyString = JSON.stringify(sessionHistory, null, 2);
        const prompt = `
            You are an expert career coach for the VoiceCoach platform.
            Analyze this user's interview session history and provide a concise, encouraging summary of their progress.
            - Highlight their average score.
            - Identify one key recurring strength they demonstrate.
            - Identify one primary area for consistent improvement.
            - Keep the summary to about 3-4 short paragraphs.

            Session History:
            ${historyString}
        `;
        const result = await callGeminiAPI(prompt);
        setSummaryContent(result);
        setIsSummaryLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4 sm:p-8">
            <Modal
                title="AI Progress Summary"
                content={isSummaryLoading ? 'Analyzing your progress...' : summaryContent}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Welcome Back, Max!</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Here's a summary of your progress.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleSummarizeProgress}
                            disabled={sessionHistory.length === 0}
                        >
                            <SparklesIcon className="mr-2 h-4 w-4" /> Summarize My Progress
                        </Button>
                        <Button size="lg" onClick={() => navigate({ page: 'serviceSelection' })}>
                            Start New Session
                        </Button>
                        <Button variant="ghost" onClick={handleLogout}>
                            <LogOutIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card>
                        <CardHeader><CardTitle>Total Sessions</CardTitle></CardHeader>
                        <CardContent><p className="text-5xl font-bold">{totalSessions}</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Average Score</CardTitle></CardHeader>
                        <CardContent><p className="text-5xl font-bold">{avgScore}<span className="text-2xl text-slate-500">/100</span></p></CardContent>
                    </Card>
                </div>

                <Card className="mb-8">
                    <CardHeader><CardTitle>Progress Over Time</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer>
                            <LineChart data={sessionHistory}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Session History</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {sessionHistory.length > 0 ? sessionHistory.map((session, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-4">
                                        {session.type === 'Technical' && <CodeIcon className="h-6 w-6 text-blue-500" />}
                                        {session.type === 'HR' && <TieIcon className="h-6 w-6 text-blue-500" />}
                                        {session.type === 'English' && <GlobeIcon className="h-6 w-6 text-blue-500" />}
                                        <div>
                                            <p className="font-semibold">{session.type} Interview</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{session.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-bold text-lg">{session.score}/100</p>
                                        <Button size="sm" variant="outline" onClick={() => navigate({ page: 'feedback', data: session })}>
                                            View Report
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-slate-500 py-8">
                                    You have no session history yet. Start a new session to see your progress!
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}




function ServiceSelectionPage({ navigate, setSessionType }) {
    const services = [
        { type: 'Technical', title: 'Technical Interview', icon: <CodeIcon className="h-8 w-8" />, description: 'Practice data structures, algorithms, and system design questions.' },
        { type: 'HR', title: 'HR Interview', icon: <TieIcon className="h-8 w-8" />, description: 'Prepare for behavioral questions and showcase your soft skills.' },
        { type: 'English', title: 'Speaking English', icon: <GlobeIcon className="h-8 w-8" />, description: 'Improve your fluency, pronunciation, and conversational English.' },
    ];
    const handleSelectService = (type) => { setSessionType(type); navigate({ page: 'session' }); };
    return (<div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4 sm:p-8"><div className="container mx-auto"><h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">Start a New Session</h1><p className="text-lg text-slate-600 dark:text-slate-400 mb-12">Choose a service to start practicing.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{services.map(service => (<Card key={service.type} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><CardHeader className="flex-row items-center gap-4"><div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">{service.icon}</div><CardTitle className="text-2xl">{service.title}</CardTitle></CardHeader><CardContent><p className="text-slate-600 dark:text-slate-400 mb-6">{service.description}</p><Button className="w-full" onClick={() => handleSelectService(service.type)}>Start Session</Button></CardContent></Card>))}</div><div className="text-center mt-12"><Button variant="outline" onClick={() => navigate({ page: 'dashboard' })}>Back to Dashboard</Button></div></div></div>);
}


// --- Gemini API Call Function ---
const callGeminiAPI = async (prompt) => {
    const apiKey = import.meta.env.VITE_API;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
        const result = await response.json();
        if (result.candidates && result.candidates.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Invalid response structure from Gemini API:", result);
            throw new Error("Invalid response structure from Gemini API");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return `Error: ${error.message}`;
    }
};

function FeedbackPage({ navigate, feedbackData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planContent, setPlanContent] = useState('');
    const [isPlanLoading, setIsPlanLoading] = useState(false);

    const handleCreateStudyPlan = async () => {
        setIsModalOpen(true);
        setIsPlanLoading(true);
        const feedbackString = JSON.stringify(feedbackData, null, 2);
        const prompt = `
            You are an expert career coach for the VoiceCoach platform.
            Based on this user's interview feedback report, generate a personalized, actionable 3-step study plan.
            - Keep each step concise and focused.
            - Address the specific "improvements" noted in the report.
            - Frame the plan in an encouraging and motivating tone.

            Feedback Report:
            ${feedbackString}
        `;
        const result = await callGeminiAPI(prompt);
        setPlanContent(result);
        setIsPlanLoading(false);
    };
    
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4 sm:p-8">
            <Modal title="AI-Generated Study Plan" content={isPlanLoading ? 'Creating your plan...' : planContent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Your Feedback Report</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Here's a breakdown of your performance.</p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Your Answer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-700 dark:text-slate-300 italic">"{feedbackData.answer}"</p>
                    </CardContent>
                </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="text-center"><CardHeader><CardTitle>Overall Score</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold text-blue-600 dark:text-blue-500">{feedbackData.score}<span className="text-2xl text-slate-500">/100</span></p></CardContent></Card>
                    <Card className="text-center"><CardHeader><CardTitle>Clarity</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold">{feedbackData.clarity}%</p></CardContent></Card>
                    <Card className="text-center"><CardHeader><CardTitle>Filler Words</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold">{feedbackData.fillerWords}</p></CardContent></Card>
                    <Card className="text-center"><CardHeader><CardTitle>Pace (WPM)</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold">{feedbackData.pace}</p></CardContent></Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircleIcon className="text-green-500"/> Strengths</CardTitle></CardHeader><CardContent><ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">{feedbackData.strengths.map(s => <li key={s}>{s}</li>)}</ul></CardContent></Card>
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><AlertCircleIcon className="text-yellow-500"/> Areas for Improvement</CardTitle></CardHeader><CardContent><ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">{feedbackData.improvements.map(i => <li key={i}>{i}</li>)}</ul></CardContent></Card>
                </div>
                <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" onClick={() => navigate({ page: 'dashboard' })}>Back to Dashboard</Button>
                    <Button size="lg" variant="outline" onClick={handleCreateStudyPlan}>
                        <SparklesIcon className="mr-2 h-5 w-5" /> ✨ Create Study Plan
                    </Button>
                </div>
            </div>
        </div>
    );
}


function InterviewSessionPage({ navigate, sessionType, addSessionToHistory }) {
    const [inputType, setInputType] = useState('audio'); // 'audio' or 'text'
    const [isRecording, setIsRecording] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answerText, setAnswerText] = useState(''); // Holds both transcript and typed text
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const [currentQuestion, setCurrentQuestion] = useState('');

    const questionBank = {
        Technical: [
            "Explain the difference between a process and a thread.",
            "What is a REST API? How is it different from SOAP?",
            "Describe the concept of Object-Oriented Programming.",
            "What is the purpose of a primary key in a database?",
            "Explain the difference between SQL and NoSQL databases."
        ],
        HR: [
            "Tell me about a time you had a conflict with a coworker and how you resolved it.",
            "What are your biggest strengths and weaknesses?",
            "Where do you see yourself in five years?",
            "Why do you want to work for this company?",
            "Describe a challenging situation you faced at work and how you handled it."
        ],
        English: [
            "What are your favorite hobbies and why do you enjoy them?",
            "If you could travel anywhere in the world, where would you go and why?",
            "Describe your ideal work environment.",
            "What is a skill you would like to learn and why?",
            "Tell me about a book you've read or a movie you've seen recently."
        ],
    };

    useEffect(() => {
        // Select a random question when the component mounts or sessionType changes
        const questions = questionBank[sessionType];
        const randomIndex = Math.floor(Math.random() * questions.length);
        setCurrentQuestion(questions[randomIndex]);
    }, [sessionType]);


    const getGeminiFeedback = async (question, answer) => {
        const prompt = `
            You are an expert interview coach for a platform called VoiceCoach.
            A user is practicing for a ${sessionType} interview.
            Analyze the user's answer to the provided question and generate a feedback report.
            Your response MUST be a valid JSON object. Do not include any markdown formatting like \`\`\`json.

            The question was: "${question}"
            The user's answer was: "${answer}"

            Provide your feedback in a JSON object with the following structure:
            {
              "score": <an integer score out of 100 based on the quality of the answer>,
              "clarity": <an integer percentage representing speech clarity>,
              "fillerWords": <an integer count of filler words like 'um', 'uh', 'like'>,
              "pace": <an estimated words per minute, e.g., 150>,
              "strengths": [<a string array of 2-3 positive points about the answer>],
              "improvements": [<a string array of 2-3 constructive feedback points>]
            }
        `;
        try {
            const resultText = await callGeminiAPI(prompt);
            // FIX: Clean the string to remove markdown fences before parsing
            const cleanedJsonText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanedJsonText);
        } catch (error) {
            console.error("Error parsing Gemini response:", error);
            return { score: 0, clarity: 0, fillerWords: 0, pace: 0, strengths: ["Error generating feedback."], improvements: ["Could not parse the AI response. Please try again."] };
        }
    };

    const startRecording = async () => {
        setAnswerText('');
        setAudioBlob(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error starting recording:", err);
            alert("Could not start recording. Please ensure microphone permissions are enabled.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const handleInputTypeChange = (newType) => {
        // Clear previous input when switching modes
        setAnswerText('');
        setAudioBlob(null);
        setInputType(newType);
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        let finalAnswer = answerText;

        try {
            if (inputType === 'audio') {
                if (!audioBlob) {
                    alert("Please record your answer first by clicking Start and Stop Recording.");
                    setIsSubmitting(false);
                    return;
                }
                const formData = new FormData();
               formData.append('file', audioBlob, 'recording.wav');

            const transcriptResponse = await fetch('https://itachixobito-transcription-api.hf.space/transcribe', {
         method: 'POST',
        body: formData,
         // DO NOT manually set the 'Content-Type' header.
             // The browser sets it correctly for FormData.
            });

                if (!transcriptResponse.ok) {
                    const errorData = await transcriptResponse.json();
                    throw new Error(errorData.error || `Transcription failed with status: ${transcriptResponse.status}`);
                }
                const transcriptData = await transcriptResponse.json();
                finalAnswer = transcriptData.text;
                setAnswerText(finalAnswer); // Display the final transcript
            }

            if (finalAnswer.trim() === '') {
                alert("Please provide an answer before analyzing.");
                setIsSubmitting(false);
                return;
            }

            const feedbackData = await getGeminiFeedback(currentQuestion, finalAnswer);
            const newSession = { 
                type: sessionType, 
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
                answer: finalAnswer, // Pass the answer to the session history
                ...feedbackData 
            };
            addSessionToHistory(newSession);
            navigate({ page: 'feedback', data: newSession });

        } catch (error) {
            console.error("Error in the finish process:", error);
            alert(`An error occurred: ${error.message}. Please check the console for details.`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl text-center">
                <p className="text-blue-400 font-semibold mb-4">{sessionType} Interview Practice</p>
                <Card className="bg-slate-800 border-slate-700 mb-8"><CardContent className="p-8"><h2 className="text-2xl md:text-3xl leading-snug">{currentQuestion}</h2></CardContent></Card>
                
                <div className="mb-6">
                    <div className="inline-flex rounded-md shadow-sm bg-slate-800 p-1">
                        <Button variant={inputType === 'audio' ? 'default' : 'ghost'} onClick={() => handleInputTypeChange('audio')} className="px-4 py-2 text-sm font-medium">
                            <MicIcon className="mr-2 h-5 w-5"/> Audio Input
                        </Button>
                        <Button variant={inputType === 'text' ? 'default' : 'ghost'} onClick={() => handleInputTypeChange('text')} className="px-4 py-2 text-sm font-medium">
                            <TypeIcon className="mr-2 h-5 w-5"/> Text Input
                        </Button>
                    </div>
                </div>

                {inputType === 'audio' ? (
                    <div>
                        <div className="mt-8 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-4">
                                <Button size="lg" onClick={startRecording} disabled={isRecording || isSubmitting}><MicIcon className="mr-2 h-5 w-5" /> Start Recording</Button>
                                <Button size="lg" variant="destructive" onClick={stopRecording} disabled={!isRecording || isSubmitting}><div className="w-5 h-5 mr-2 bg-white rounded-sm" /> Stop Recording</Button>
                            </div>
                            <p className={`text-lg transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-50'}`}>{isRecording ? '🔴 Recording...' : '⚫ Stopped'}</p>
                        </div>
                    </div>
                ) : (
                    <Textarea 
                        placeholder="Type your answer here..."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        rows={6}
                        disabled={isSubmitting}
                    />
                )}

                <div className="mt-8 border-t border-slate-700 pt-8">
                    <Button size="lg" onClick={handleFinish} disabled={isSubmitting || (inputType === 'audio' && !audioBlob) || (inputType === 'text' && answerText.trim() === '')}>
                        {isSubmitting ? "Analyzing..." : "Analyze My Answer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}


// --- Main App Component ---
function App() {
    const [currentPage, setCurrentPage] = useState({ page: 'landing', data: null });
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [sessionType, setSessionType] = useState('English');
    const [sessionHistory, setSessionHistory] = useState([]);

    const navigate = (pageInfo) => {
        setCurrentPage(pageInfo);
        window.scrollTo(0, 0);
    };

    const addSessionToHistory = (newSession) => {
        setSessionHistory(prevHistory => [newSession, ...prevHistory]);
    };

    const renderPage = () => {
        if (!isSignedIn) {
            switch (currentPage.page) {
                case 'auth': return <AuthComponent navigate={navigate} setIsSignedIn={setIsSignedIn} />;
                default: return <LandingPage navigate={navigate} isSignedIn={isSignedIn} />;
            }
        }
        
        switch (currentPage.page) {
            case 'serviceSelection': return <ServiceSelectionPage navigate={navigate} setSessionType={setSessionType} />;
            case 'session': return <InterviewSessionPage navigate={navigate} sessionType={sessionType} addSessionToHistory={addSessionToHistory} />;
            case 'feedback': return <FeedbackPage navigate={navigate} feedbackData={currentPage.data} />;
            case 'dashboard':
            default:
                return <DashboardPage navigate={navigate} sessionHistory={sessionHistory} setIsSignedIn={setIsSignedIn} />;
        }
    };

    return <>{renderPage()}</>;
}

export default App;
