import React, { useState, useEffect } from 'react';

// --- Icon Components ---
const MicIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
);
const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const BarChartIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
);
const CameraIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
);
const MenuIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);
const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const LogOutIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const CodeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);
const TieIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-4-4-4-8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9c0 4-4 8-4 8z"/><path d="M12 7v15"/><path d="m9 7 3-4 3 4"/></svg>
);
const GlobeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);
const CheckCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const AlertCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

// --- Mock shadcn/ui Components ---
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300";
  const variants = {
    default: "bg-blue-600 text-slate-50 hover:bg-blue-600/90 dark:bg-blue-500 dark:text-slate-50 dark:hover:bg-blue-500/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
  };
  const sizes = { default: "h-10 px-4 py-2", lg: "h-11 rounded-md px-8 text-base" };
  return <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};
const Card = ({ children, className = '' }) => <div className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }) => <h3 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }) => <p className={`text-sm text-slate-500 dark:text-slate-400 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Input = ({ className = '', ...props }) => (<input className={`flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-500 ${className}`} {...props} />);
const Label = ({ className = '', ...props }) => (<label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props} />);
const Tabs = ({ children, defaultValue, onValueChange, className = '' }) => { const [activeTab, setActiveTab] = useState(defaultValue); const handleTabChange = (value) => { setActiveTab(value); if (onValueChange) onValueChange(value); }; return (<div className={className}>{React.Children.map(children, child => { if (!child) return null; if (child.type === TabsList) { return React.cloneElement(child, { activeTab, onTabChange: handleTabChange }); } if (child.type === TabsContent && child.props.value === activeTab) { return child; } return null; })}</div>); };
const TabsList = ({ children, activeTab, onTabChange, className = '' }) => <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}>{React.Children.map(children, child => React.cloneElement(child, { activeTab, onTabChange }))}</div>;
const TabsTrigger = ({ children, value, activeTab, onTabChange, className = '' }) => <button onClick={() => onTabChange(value)} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === value ? 'bg-white shadow-sm text-slate-950 dark:bg-slate-950 dark:text-slate-50' : ''} ${className}`}>{children}</button>;
const TabsContent = ({ children, value, className = '' }) => <div className={`mt-4 ${className}`}>{children}</div>;


// --- Page Components ---

function LandingPage({ navigate, isSignedIn }) {
    // This component remains largely the same, but the Navbar and Hero buttons now use the router
    const Navbar = ({ navigate, isSignedIn }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [isScrolled, setIsScrolled] = useState(false);
        useEffect(() => { const handleScroll = () => setIsScrolled(window.scrollY > 10); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);

        return (
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80' : 'bg-transparent'}`}>
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <a href="#" onClick={() => navigate('landing')} className="flex items-center gap-2 font-bold text-lg cursor-pointer"><MicIcon className="h-6 w-6 text-blue-500" /><span>VoiceCoach</span></a>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium"><a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Features</a><a href="#testimonials" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Testimonials</a><a href="#" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Pricing</a></nav>
                    <div className="hidden md:flex items-center gap-2"><Button variant="ghost" onClick={() => navigate('auth')}>Sign In</Button><Button onClick={() => navigate(isSignedIn ? 'dashboard' : 'auth')}>{isSignedIn ? 'Dashboard' : 'Start Free Trial'}</Button></div>
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">{isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}</button>
                </div>
                {isOpen && (<div className="md:hidden bg-white dark:bg-slate-950 p-6 border-t"><nav className="flex flex-col gap-4 text-lg"><a href="#features" onClick={() => setIsOpen(false)}>Features</a><a href="#testimonials" onClick={() => setIsOpen(false)}>Testimonials</a><a href="#" onClick={() => setIsOpen(false)}>Pricing</a><div className="flex flex-col gap-4 mt-4"><Button variant="outline" onClick={() => { navigate('auth'); setIsOpen(false); }}>Sign In</Button><Button onClick={() => { navigate(isSignedIn ? 'dashboard' : 'auth'); setIsOpen(false); }}>{isSignedIn ? 'Dashboard' : 'Start Free Trial'}</Button></div></nav></div>)}
            </header>
        );
    };
    const HeroSection = ({ navigate, isSignedIn }) => (
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 md:px-6 text-center"><div className="max-w-3xl mx-auto"><h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text">Ace Your Next Interview with AI</h1><p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8">VoiceCoach analyzes your speech, prepares you for technical & HR rounds, and gives you the confidence to land your dream job.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Button size="lg" onClick={() => navigate(isSignedIn ? 'dashboard' : 'auth')}>Start Practicing Now</Button><Button size="lg" variant="outline">Watch a Demo</Button></div></div></div>
        </section>
    );
    // Features, CrazyFeature, Testimonials sections would be here, unchanged.
    return (
        <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <Navbar navigate={navigate} isSignedIn={isSignedIn} />
            <main><HeroSection navigate={navigate} isSignedIn={isSignedIn} /></main>
        </div>
    );
}

function AuthComponent({ navigate, setIsSignedIn }) {
    const handleAuth = () => { setIsSignedIn(true); navigate('dashboard'); };
    return (
        <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <a href="#" onClick={() => navigate('landing')} className="flex items-center gap-2 font-bold text-lg cursor-pointer mb-8"><MicIcon className="h-6 w-6 text-blue-500" /><span>VoiceCoach</span></a>
            <Card className="w-full max-w-[400px]"><CardHeader className="text-center"><CardTitle>Get Started</CardTitle><CardDescription>Sign in or create an account to continue</CardDescription></CardHeader><CardContent className="p-4 sm:p-6"><Tabs defaultValue="sign-in" className="w-full"><TabsList className="grid w-full grid-cols-2 mb-6"><TabsTrigger value="sign-in">Sign In</TabsTrigger><TabsTrigger value="sign-up">Sign Up</TabsTrigger></TabsList><TabsContent value="sign-in"><div className="space-y-4"><div className="grid w-full items-center gap-1.5"><Label htmlFor="email-in">Email</Label><Input type="email" id="email-in" placeholder="m@example.com" /></div><div className="grid w-full items-center gap-1.5"><Label htmlFor="password-in">Password</Label><Input type="password" id="password-in" placeholder="••••••••" /></div><Button className="w-full" onClick={handleAuth}>Sign In</Button></div></TabsContent><TabsContent value="sign-up"><div className="space-y-4"><div className="grid w-full items-center gap-1.5"><Label htmlFor="name-up">Name</Label><Input type="text" id="name-up" placeholder="Max Robinson" /></div><div className="grid w-full items-center gap-1.5"><Label htmlFor="email-up">Email</Label><Input type="email" id="email-up" placeholder="m@example.com" /></div><div className="grid w-full items-center gap-1.5"><Label htmlFor="password-up">Password</Label><Input type="password" id="password-up" placeholder="••••••••" /></div><Button className="w-full" onClick={handleAuth}>Create Account</Button></div></TabsContent></Tabs></CardContent></Card>
        </div>
    );
}

function DashboardPage({ navigate, setSessionType }) {
    const services = [
        { type: 'Technical', title: 'Technical Interview', icon: <CodeIcon className="h-8 w-8" />, description: 'Practice data structures, algorithms, and system design questions.' },
        { type: 'HR', title: 'HR Interview', icon: <TieIcon className="h-8 w-8" />, description: 'Prepare for behavioral questions and showcase your soft skills.' },
        { type: 'English', title: 'Speaking English', icon: <GlobeIcon className="h-8 w-8" />, description: 'Improve your fluency, pronunciation, and conversational English.' },
    ];

    const handleSelectService = (type) => {
        setSessionType(type);
        navigate('session');
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4 sm:p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-900 dark:text-white">Welcome Back!</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">Choose a service to start practicing.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map(service => (
                        <Card key={service.type} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <CardHeader className="flex-row items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">{service.icon}</div>
                                <CardTitle className="text-2xl">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">{service.description}</p>
                                <Button className="w-full" onClick={() => handleSelectService(service.type)}>Start Session</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InterviewSessionPage({ navigate, sessionType }) {
    const [isListening, setIsListening] = useState(true);
    const questions = {
        Technical: "Explain the difference between a process and a thread. Why would you use one over the other?",
        HR: "Tell me about a time you had a conflict with a coworker and how you resolved it.",
        English: "What are your favorite hobbies and why do you enjoy them?",
    };

    const handleFinish = () => {
        setIsListening(false);
        // Simulate API call and then navigate
        setTimeout(() => {
            navigate('feedback');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-3xl text-center">
                <p className="text-blue-400 font-semibold mb-4">{sessionType} Interview Practice</p>
                <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-8">
                        <h2 className="text-2xl md:text-3xl leading-snug">{questions[sessionType]}</h2>
                    </CardContent>
                </Card>

                <div className="mt-12">
                    <div className={`relative mx-auto h-24 w-24 flex items-center justify-center rounded-full transition-colors duration-300 ${isListening ? 'bg-red-500' : 'bg-slate-600'}`}>
                        <MicIcon className="h-10 w-10 text-white" />
                        {isListening && <div className="absolute inset-0 rounded-full bg-red-500 animate-ping"></div>}
                    </div>
                    <p className={`mt-4 text-lg transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-0'}`}>Listening...</p>
                </div>
                
                <div className="mt-8">
                    <Button size="lg" onClick={handleFinish} disabled={!isListening}>
                        {isListening ? "I'm Done Answering" : "Generating Feedback..."}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function FeedbackPage({ navigate }) {
    // This is mock data, simulating an API response
    const feedbackData = {
        score: 88,
        clarity: 92,
        fillerWords: 3, // count
        pace: 155, // words per minute
        strengths: ["Clear articulation", "Good structure in your answer"],
        improvements: ["Try to reduce the use of 'um'", "Slightly fast pace, try to pause between points"]
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 p-4 sm:p-8">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Your Feedback Report</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Here's a breakdown of your performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="text-center"><CardHeader><CardTitle>Overall Score</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold text-blue-600 dark:text-blue-500">{feedbackData.score}<span className="text-2xl text-slate-500">/100</span></p></CardContent></Card>
                    <Card className="text-center"><CardHeader><CardTitle>Clarity</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold">{feedbackData.clarity}%</p></CardContent></Card>
                    <Card className="text-center"><CardHeader><CardTitle>Filler Words</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold">{feedbackData.fillerWords}</p></CardContent></Card>
                    <Card className="text-center"><CardHeader><CardTitle>Pace (WPM)</CardTitle></CardHeader><CardContent><p className="text-5xl font-bold">{feedbackData.pace}</p></CardContent></Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircleIcon className="text-green-500"/> Strengths</CardTitle></CardHeader>
                        <CardContent><ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">{feedbackData.strengths.map(s => <li key={s}>{s}</li>)}</ul></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircleIcon className="text-yellow-500"/> Areas for Improvement</CardTitle></CardHeader>
                        <CardContent><ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">{feedbackData.improvements.map(i => <li key={i}>{i}</li>)}</ul></CardContent>
                    </Card>
                </div>
                
                <div className="text-center mt-12">
                    <Button size="lg" onClick={() => navigate('dashboard')}>Practice Again</Button>
                </div>
            </div>
        </div>
    );
}

// Main App Component acting as a router
function App() {
    const [currentPage, setCurrentPage] = useState('landing');
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [sessionType, setSessionType] = useState('Technical'); // Default session type

    const navigate = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        if (!isSignedIn) {
            switch (currentPage) {
                case 'auth': return <AuthComponent navigate={navigate} setIsSignedIn={setIsSignedIn} />;
                default: return <LandingPage navigate={navigate} isSignedIn={isSignedIn} />;
            }
        }
        
        // Routes available only when signed in
        switch (currentPage) {
            case 'session': return <InterviewSessionPage navigate={navigate} sessionType={sessionType} />;
            case 'feedback': return <FeedbackPage navigate={navigate} />;
            case 'dashboard':
            default:
                return <DashboardPage navigate={navigate} setSessionType={setSessionType} />;
        }
    };

    return <>{renderPage()}</>;
}

export default App;
