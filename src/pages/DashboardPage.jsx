import React from 'react';
import { Link } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { useSummarizeProgress } from '../hooks/useVoiceCoach';

// Import reusable UI components
import Button from '../components/common/Button.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import Modal from '../components/common/Model.jsx'; // Corrected typo from 'Model' to 'Modal'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

// Import Icons
import { SparklesIcon, CodeIcon, TieIcon, GlobeIcon, BarChartIcon } from '../components/icons/index.jsx';

/**
 * A reusable mock chart component.
 * In a real application, this would be replaced with a library like Recharts.
 */
const ProgressChart = ({ data }) => (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 flex items-end">
        {data && data.length > 0 ? (
            <div className="w-full h-full border-l-2 border-b-2 border-slate-300 dark:border-slate-600 relative">
                <svg className="absolute inset-0" width="100%" height="100%" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.score}`).join(' ')}
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>
        ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
                <p>No data to display</p>
            </div>
        )}
    </div>
);

/**
 * A visually appealing component to show when there is no session history.
 */
const EmptyState = () => (
    <div className="text-center py-16">
        <BarChartIcon className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">No Sessions Yet</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start a new practice session to see your progress here.</p>
        <div className="mt-6">
            <Link to="/app/new-session">
                <Button>Start First Session</Button>
            </Link>
        </div>
    </div>
);


/**
 * The main dashboard page where users can view their progress and session history.
 */
function DashboardPage() {
    const { sessionHistory } = useSessions();
    const { mutate: summarizeProgress, data: summaryContent, isPending: isSummaryLoading } = useSummarizeProgress();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    // Calculate statistics from session history
    const totalSessions = sessionHistory.length;
    const avgScore = totalSessions > 0
        ? (sessionHistory.reduce((acc, s) => acc + s.score, 0) / totalSessions).toFixed(0)
        : 0;

    const handleSummarizeProgress = () => {
        if (sessionHistory.length === 0) return;
        summarizeProgress(sessionHistory);
        setIsModalOpen(true);
    };

    const getSessionIcon = (type) => {
        switch (type) {
            case 'Technical': return <CodeIcon className="h-6 w-6 text-blue-500" />;
            case 'HR': return <TieIcon className="h-6 w-6 text-blue-500" />;
            case 'English': return <GlobeIcon className="h-6 w-6 text-blue-500" />;
            default: return null;
        }
    };

    return (
        <div className="container mx-auto">
            <Modal
                title="AI Progress Summary"
                content={isSummaryLoading ? <LoadingSpinner /> : summaryContent}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Welcome Back!</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Here's a summary of your progress.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSummarizeProgress}
                        disabled={sessionHistory.length === 0 || isSummaryLoading}
                    >
                        <SparklesIcon className="mr-2 h-4 w-4" />
                        {isSummaryLoading ? 'Analyzing...' : 'Summarize My Progress'}
                    </Button>
                    {/* FIX: Correct way to handle navigation with a custom Button component */}
                    <Link to="/app/new-session">
                        <Button size="lg">Start New Session</Button>
                    </Link>
                </div>
            </div>

            {/* Stat Cards */}
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

            {/* Progress Chart */}
            <Card className="mb-8">
                <CardHeader><CardTitle>Progress Over Time</CardTitle></CardHeader>
                <CardContent className="h-80">
                    <ProgressChart data={[...sessionHistory].reverse()} />
                </CardContent>
            </Card>

            {/* Session History List */}
            <Card>
                <CardHeader><CardTitle>Session History</CardTitle></CardHeader>
                <CardContent>
                    {sessionHistory.length > 0 ? (
                        <div className="space-y-4">
                            {sessionHistory.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                                    <div className="flex items-center gap-4">
                                        {getSessionIcon(session.type)}
                                        <div>
                                            <p className="font-semibold">{session.type} Interview</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{session.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-bold text-lg">{session.score}/100</p>
                                        {/* FIX: Correct way to handle navigation with a custom Button component */}
                                        <Link to={`/app/feedback/${session.id}`}>
                                            <Button size="sm" variant="outline">
                                                View Report
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardPage;
