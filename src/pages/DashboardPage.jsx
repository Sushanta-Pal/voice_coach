import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { useSummarizeProgress } from '../hooks/useVoiceCoach';

// Import reusable UI components
import Button from '../components/common/Button.jsx';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/common/Card.jsx';
import Modal from '../components/common/Model.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

// Import Icons
import { Sparkles, Code, Briefcase, Globe, BarChart, PlusCircle } from 'lucide-react';

/**
 * A visually enhanced progress chart with gradient and animations.
 */
const ProgressChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
                <p>No data to display</p>
            </div>
        );
    }

    const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.score}`).join(' ');

    return (
        <div className="w-full h-full p-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <polyline
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    className="animate-draw"
                />
                {data.map((d, i) => (
                    <circle
                        key={i}
                        cx={(i / (data.length - 1)) * 100}
                        cy={100 - d.score}
                        r="1.5"
                        fill="#fff"
                        stroke="#8b5cf6"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        className="opacity-0 animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                    />
                ))}
            </svg>
            <style>{`
                .animate-draw {
                    stroke-dasharray: 1000;
                    stroke-dashoffset: 1000;
                    animation: draw 2s ease-out forwards;
                }
                @keyframes draw {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                @keyframes fade-in {
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

/**
 * A visually appealing component for when there is no session history.
 */
const EmptyState = () => (
    <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
        <BarChart className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Your Journey Starts Here</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Complete your first session to see your progress and unlock AI insights.</p>
        <div className="mt-6">
            <Link to="/app/new-session">
                <Button>Start First Session</Button>
            </Link>
        </div>
    </div>
);

/**
 * The main dashboard page with enhanced UI and special effects.
 */
function DashboardPage() {
    const { sessionHistory } = useSessions();
    const { mutate: summarizeProgress, data: summaryContent, isPending: isSummaryLoading } = useSummarizeProgress();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const totalSessions = sessionHistory.length;
    const avgScore = totalSessions > 0 ? (sessionHistory.reduce((acc, s) => acc + s.score, 0) / totalSessions).toFixed(0) : 0;

    const handleSummarizeProgress = () => {
        if (sessionHistory.length === 0) return;
        summarizeProgress(sessionHistory);
        setIsModalOpen(true);
    };

    const getSessionIcon = (type) => {
        switch (type) {
            case 'Technical': return <Code className="h-8 w-8 text-slate-500" />;
            case 'HR': return <Briefcase className="h-8 w-8 text-slate-500" />;
            case 'Communication': return <Globe className="h-8 w-8 text-slate-500" />;
            default: return null;
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Spotlight Effect */}
            <div
                className="pointer-events-none fixed inset-0 z-30 transition duration-300"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
                }}
            />
            <div className="container mx-auto relative z-40">
                <Modal
                    title="AI Progress Summary"
                    content={isSummaryLoading ? <LoadingSpinner /> : summaryContent}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />

                {/* Header */}
                <div className="text-center pt-8 pb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back!</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Ready to sharpen your skills? Let's dive into your progress and plan your next session.</p>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <Button variant="outline" onClick={handleSummarizeProgress} disabled={sessionHistory.length === 0 || isSummaryLoading}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isSummaryLoading ? 'Analyzing...' : 'AI Summary'}
                        </Button>
                        <Link to="/app/new-session">
                            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:opacity-90">
                                <PlusCircle className="mr-2" /> Start New Session
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card className="group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardHeader>
                            <CardTitle>Total Sessions</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-6xl font-bold">{totalSessions}</p></CardContent>
                    </Card>
                    <Card className="group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <CardHeader>
                            <CardTitle>Average Score</CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-6xl font-bold">{avgScore}<span className="text-3xl text-slate-500">/100</span></p></CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="h-full">
                            <CardHeader><CardTitle>Progress Over Time</CardTitle></CardHeader>
                            <CardContent className="h-80">
                                <ProgressChart data={[...sessionHistory].reverse()} />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader><CardTitle>Session History</CardTitle></CardHeader>
                            <CardContent>
                                {sessionHistory.length > 0 ? (
                                    <div className="space-y-4 max-h-[25rem] overflow-y-auto pr-2">
                                        {sessionHistory.map((session) => (
                                            <Link to={`/app/feedback/${session.id}`} key={session.id} className="block group">
                                                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        {getSessionIcon(session.type)}
                                                        <div>
                                                            <p className="font-semibold">{session.type} Interview</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{session.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-lg">{session.score}/100</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
