import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button  from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/common/Card';
import { MicIcon, UsersIcon, BarChartIcon, MenuIcon, XIcon } from '../components/icons/index';
import Footer from '../components/layout/Footer';

/**
 * Navigation bar for the landing page.
 */
const Navbar = ({ onGetStarted }) => {
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
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <MicIcon className="h-6 w-6 text-blue-500" />
                    <span>VoiceCoach</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">Features</a>
                    <a href="#testimonials" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">Testimonials</a>
                </nav>
                <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" onClick={onGetStarted}>Sign In</Button>
                    <Button onClick={onGetStarted}>Start Free Trial</Button>
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
                        <div className="flex flex-col gap-4 mt-4">
                            <Button variant="outline" onClick={() => { onGetStarted(); setIsOpen(false); }}>Sign In</Button>
                            <Button onClick={() => { onGetStarted(); setIsOpen(false); }}>Start Free Trial</Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

/**
 * The main hero section of the landing page.
 */
const HeroSection = ({ onGetStarted }) => (
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
                    <Button size="lg" onClick={onGetStarted}>Start Practicing Now</Button>
                    <Button size="lg" variant="outline">Watch a Demo</Button>
                </div>
            </div>
        </div>
    </section>
);

/**
 * Section highlighting the key features of the application.
 */
const FeaturesSection = () => {
    const features = [
        { icon: <MicIcon className="h-8 w-8 text-blue-500" />, title: "Real-time Speech Analysis", description: "Get instant feedback on your pacing, filler words, and clarity to sound more confident and professional." },
        { icon: <UsersIcon className="h-8 w-8 text-blue-500" />, title: "Unlimited Mock Interviews", description: "Practice with AI interviewers for various roles, from HR questions to complex technical challenges." },
        { icon: <BarChartIcon className="h-8 w-8 text-blue-500" />, title: "Personalized Dashboard", description: "Track your progress over time with detailed analytics and identify key areas for improvement." },
    ];
    return (
        <section id="features" className="w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Personal Interview Toolkit</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Everything you need to go from nervous to prepared.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Card key={feature.title} className="text-center flex flex-col items-center p-4">
                            <CardHeader>
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

/**
 * Section displaying testimonials from users.
 */
const TestimonialSection = () => {
    const testimonials = [
        { name: "Sarah L.", role: "Software Engineer @ Google", quote: "VoiceCoach was a game-changer. The AI feedback on my technical explanations helped me nail the final round." },
        { name: "Michael B.", role: "Product Manager @ Stripe", quote: "I used to ramble and use so many filler words. The dashboard showed me exactly where to improve. I felt so much more confident." },
        { name: "Jessica Y.", role: "UX Designer @ Airbnb", quote: "The mock interviews are incredibly realistic. It's like having a hiring manager on call 24/7. 10/10 would recommend." },
    ];
    return (
        <section id="testimonials" className="w-full py-20 md:py-32 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Trusted by Professionals at Top Companies</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(t => (
                        <Card key={t.name}>
                            <CardContent className="pt-6">
                                <p className="italic">"{t.quote}"</p>
                            </CardContent>
                            <CardHeader>
                                <CardTitle>{t.name}</CardTitle>
                                <CardDescription>{t.role}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

/**
 * The main landing page component.
 */
const LandingPage = () => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate(isSignedIn ? '/app/dashboard' : '/auth');
    };

    return (
        <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <Navbar onGetStarted={handleGetStarted} />
            <main>
                <HeroSection onGetStarted={handleGetStarted} />
                <FeaturesSection />
                <TestimonialSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
