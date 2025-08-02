import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';

// Import reusable UI components
import Button from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/common/Card';
import { Mic, Users, BarChart, Menu, X } from 'lucide-react'; // Using lucide-react for consistency
import Footer from '../components/layout/Footer';

/**
 * Navigation bar for the landing page, now integrated with Clerk.
 */
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDashboardClick = () => {
        navigate('/app/dashboard');
    };

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80' : 'bg-transparent'}`}>
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <Mic className="h-6 w-6 text-blue-500" />
                    <span>VoiceCoach</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <a href="#features" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">Features</a>
                    <a href="#testimonials" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors">Testimonials</a>
                </nav>
                <div className="hidden md:flex items-center gap-2">
                    {isSignedIn ? (
                        <Button onClick={handleDashboardClick}>Go to Dashboard</Button>
                    ) : (
                        <>
                            <SignInButton mode="modal">
                                <Button variant="ghost">Sign In</Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button>Start Free Trial</Button>
                            </SignUpButton>
                        </>
                    )}
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-slate-950 p-6 border-t">
                    {/* Mobile navigation can be added here if needed */}
                </div>
            )}
        </header>
    );
};

/**
 * The main hero section of the landing page.
 */
const HeroSection = () => (
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
                    <SignUpButton mode="modal">
                        <Button size="lg">Start Practicing Now</Button>
                    </SignUpButton>
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
        { icon: <Mic className="h-8 w-8 text-blue-500" />, title: "Real-time Speech Analysis", description: "Get instant feedback on your pacing, filler words, and clarity to sound more confident and professional." },
        { icon: <Users className="h-8 w-8 text-blue-500" />, title: "Unlimited Mock Interviews", description: "Practice with AI interviewers for various roles, from HR questions to complex technical challenges." },
        { icon: <BarChart className="h-8 w-8 text-blue-500" />, title: "Personalized Dashboard", description: "Track your progress over time with detailed analytics and identify key areas for improvement." },
    ];
    return (
        <section id="features" className="w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50">
            {/* Feature content unchanged */}
        </section>
    );
};

/**
 * Section displaying testimonials from users.
 */
const TestimonialSection = () => {
    // Testimonial content unchanged
    return (
        <section id="testimonials" className="w-full py-20 md:py-32 bg-white dark:bg-slate-950">
            {/* Testimonial content unchanged */}
        </section>
    );
};

/**
 * The main landing page component.
 */
const LondingPage = () => {
    // The useAuth hook and handleGetStarted function are no longer needed here.
    // The Navbar and HeroSection now handle navigation directly with Clerk's components.
    return (
        <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <TestimonialSection />
            </main>
            <Footer />
        </div>
    );
};

export default LondingPage;
