import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';
import { useCreateStudyPlan } from '../hooks/useVoiceCoach';

// Import reusable UI components
import  Button from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Modal from '../components/common/Model';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import Icons
import { SparklesIcon, CheckCircleIcon, AlertCircleIcon } from '../components/icons/index';

/**
 * Displays a detailed feedback report for a single interview session.
 */
function FeedbackPage() {
    const { sessionId } = useParams();
    const { getSessionById } = useSessions();
    const { mutate: createStudyPlan, data: planContent, isPending: isPlanLoading } = useCreateStudyPlan();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const feedbackData = getSessionById(sessionId);

    const handleCreateStudyPlan = () => {
        if (!feedbackData) return;
        createStudyPlan(feedbackData);
        setIsModalOpen(true);
    };

    // If no session is found for the given ID, redirect to the dashboard.
    if (!feedbackData) {
        return <Navigate to="/app/dashboard" replace />;
    }

    return (
        <div className="container mx-auto">
            <Modal
                title="AI-Generated Study Plan"
                content={isPlanLoading ? <LoadingSpinner /> : planContent}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Your Feedback Report</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Here's a breakdown of your performance for the {feedbackData.type} session.</p>
            </div>

            {/* User's Answer */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 italic">"{feedbackData.answer}"</p>
                </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="text-center">
                    <CardHeader><CardTitle>Overall Score</CardTitle></CardHeader>
                    <CardContent><p className="text-5xl font-bold text-blue-600 dark:text-blue-500">{feedbackData.score}<span className="text-2xl text-slate-500">/100</span></p></CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader><CardTitle>Clarity</CardTitle></CardHeader>
                    <CardContent><p className="text-5xl font-bold">{feedbackData.clarity}%</p></CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader><CardTitle>Filler Words</CardTitle></CardHeader>
                    <CardContent><p className="text-5xl font-bold">{feedbackData.fillerWords}</p></CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader><CardTitle>Pace (WPM)</CardTitle></CardHeader>
                    <CardContent><p className="text-5xl font-bold">{feedbackData.pace}</p></CardContent>
                </Card>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircleIcon className="text-green-500" /> Strengths</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            {feedbackData.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircleIcon className="text-yellow-500" /> Areas for Improvement</CardTitle></CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                            {feedbackData.improvements.map((i, k) => <li key={k}>{i}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons */}
            <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button as={Link} to="/app/dashboard" size="lg">
                    Back to Dashboard
                </Button>
                <Button size="lg" variant="outline" onClick={handleCreateStudyPlan} disabled={isPlanLoading}>
                    <SparklesIcon className="mr-2 h-5 w-5" />
                    {isPlanLoading ? 'Creating Plan...' : 'Create Study Plan'}
                </Button>
            </div>
        </div>
    );
}

export default FeedbackPage;
