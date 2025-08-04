// import React, { useState, useEffect } from 'react';
// import { useParams, Link, Navigate } from 'react-router-dom';
// import { useSessions } from '../hooks/useSessions';
// import { useCreateStudyPlan } from '../hooks/useVoiceCoach';

// // Import reusable UI components
// import Button from '../components/common/Button';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/common/Card';
// import Modal from '../components/common/Model.jsx';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/common/Tabs';

// // Import Icons
// import { SparklesIcon, CheckCircle, XCircle, BarChart, Annoyed, Wind, MessageSquareQuote } from 'lucide-react';

// /**
//  * A component to display a score with a dynamic radial progress bar.
//  */
// const RadialProgress = ({ score }) => {
//     const [progress, setProgress] = useState(0);
//     const radius = 80;
//     const circumference = 2 * Math.PI * radius;
//     const offset = circumference - (progress / 100) * circumference;

//     useEffect(() => {
//         const animation = requestAnimationFrame(() => setProgress(score || 0));
//         return () => cancelAnimationFrame(animation);
//     }, [score]);

//     return (
//         <div className="relative flex items-center justify-center w-52 h-52">
//             <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 200">
//                 <circle cx="100" cy="100" r={radius} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="15" fill="transparent" />
//                 <circle
//                     cx="100"
//                     cy="100"
//                     r={radius}
//                     className="stroke-blue-500"
//                     strokeWidth="15"
//                     fill="transparent"
//                     strokeDasharray={circumference}
//                     strokeDashoffset={offset}
//                     strokeLinecap="round"
//                     transform="rotate(-90 100 100)"
//                     style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
//                 />
//             </svg>
//             <div className="relative text-center">
//                 <p className="text-5xl font-bold text-slate-900 dark:text-white">{progress}</p>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">out of 100</p>
//             </div>
//         </div>
//     );
// };

// /**
//  * A small component to display a single performance metric.
//  */
// const MetricItem = ({ icon, title, value, unit }) => (
//     <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
//         <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-md">{icon}</div>
//         <div>
//             <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
//             <p className="font-semibold text-slate-900 dark:text-white">{value} {unit}</p>
//         </div>
//     </div>
// );

// /**
//  * Displays a detailed feedback report for a single interview session.
//  */
// function FeedbackPage() {
//     const { sessionId } = useParams();
//     const { getSessionById } = useSessions();
//     const { mutate: createStudyPlan, data: planContent, isPending: isPlanLoading } = useCreateStudyPlan();
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const feedbackData = getSessionById(sessionId);

//     const handleCreateStudyPlan = () => {
//         if (!feedbackData) return;
//         createStudyPlan(feedbackData);
//         setIsModalOpen(true);
//     };

//     if (!feedbackData) {
//         return <Navigate to="/app/dashboard" replace />;
//     }

//     return (
//         <div className="container mx-auto max-w-5xl">
//             <Modal
//                 title="AI-Generated Study Plan"
//                 content={isPlanLoading ? <LoadingSpinner /> : planContent}
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//             />

//             {/* Header */}
//             <div className="text-center mb-12">
//                 <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Performance Report</h1>
//                 <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">An AI-powered breakdown of your {feedbackData.type} interview.</p>
//             </div>

//             {/* Main Content Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//                 {/* Left Column: Score and Metrics */}
//                 <div className="lg:col-span-2 space-y-8">
//                     <Card className="flex flex-col items-center justify-center p-6">
//                         <CardHeader className="text-center mb-4">
//                             <CardTitle>Overall Score</CardTitle>
//                         </CardHeader>
//                         <RadialProgress score={feedbackData.score} />
//                     </Card>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Key Metrics</CardTitle>
//                         </CardHeader>
//                         <CardContent className="grid grid-cols-2 gap-4">
//                             <MetricItem icon={<BarChart size={20} className="text-blue-500" />} title="Clarity" value={feedbackData.clarity} unit="%" />
//                             <MetricItem icon={<Annoyed size={20} className="text-orange-500" />} title="Filler Words" value={feedbackData.fillerWords} />
//                             <MetricItem icon={<Wind size={20} className="text-purple-500" />} title="Pace" value={feedbackData.pace} unit="WPM" />
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Right Column: Details */}
//                 <div className="lg:col-span-3 space-y-8">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2"><MessageSquareQuote /> Your Answer</CardTitle>
//                         </CardHeader>
//                         <CardContent className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
//                             <blockquote>"{feedbackData.answer}"</blockquote>
//                         </CardContent>
//                     </Card>
//                     <Card>
//                         <Tabs defaultValue="strengths" className="w-full">
//                             <CardHeader>
//                                 <TabsList className="grid w-full grid-cols-2">
//                                     <TabsTrigger value="strengths">Strengths</TabsTrigger>
//                                     <TabsTrigger value="improvements">Improvements</TabsTrigger>
//                                 </TabsList>
//                             </CardHeader>
//                             <TabsContent value="strengths" className="px-6 pb-6">
//                                 <ul className="space-y-3">
//                                     {feedbackData.strengths.map((s, i) => (
//                                         <li key={i} className="flex items-start gap-3">
//                                             <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
//                                             <span>{s}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </TabsContent>
//                             <TabsContent value="improvements" className="px-6 pb-6">
//                                 <ul className="space-y-3">
//                                     {feedbackData.improvements.map((item, k) => (
//                                         <li key={k} className="flex items-start gap-3">
//                                             <XCircle className="text-yellow-500 mt-1 flex-shrink-0" size={18} />
//                                             <span>{item}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </TabsContent>
//                         </Tabs>
//                     </Card>
//                 </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="text-center mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
//                 <Link to="/app/dashboard">
//                     <Button size="lg" variant="ghost">Back to Dashboard</Button>
//                 </Link>
//                 <Button size="lg" onClick={handleCreateStudyPlan} disabled={isPlanLoading} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 shadow-lg">
//                     <SparklesIcon className="mr-2 h-5 w-5" />
//                     {isPlanLoading ? 'Creating Plan...' : 'Create AI Study Plan'}
//                 </Button>
//             </div>
//         </div>
//     );
// }

// export default FeedbackPage;

import React, { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSessions } from "../hooks/useSessions";
import { useCreateStudyPlan } from "../hooks/useVoiceCoach";

// Import reusable UI components
import Button from "../components/common/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/common/Card";
import Modal from "../components/common/Model.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/common/Tabs";

// Import Icons
import {
  SparklesIcon,
  CheckCircle,
  XCircle,
  BarChart,
  Annoyed,
  Wind,
  MessageSquareQuote,
  BookOpen,
  Repeat,
  BrainCircuit,
} from "lucide-react";
import StructuredReport from "../components/common/StructuredReport";

// ... (RadialProgress and MetricItem components remain the same)
const RadialProgress = ({ score }) => {
  const [progress, setProgress] = useState(0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setProgress(score || 0));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-52 h-52">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 200 200"
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-slate-200 dark:stroke-slate-700"
          strokeWidth="15"
          fill="transparent"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-blue-500"
          strokeWidth="15"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="relative text-center">
        <p className="text-5xl font-bold text-slate-900 dark:text-white">
          {progress}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">out of 100</p>
      </div>
    </div>
  );
};

const MetricItem = ({ icon, title, value, unit }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
    <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-md">{icon}</div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="font-semibold text-slate-900 dark:text-white">
        {value} {unit}
      </p>
    </div>
  </div>
);

// NEW: A smaller score card for the communication breakdown
const ScoreCard = ({ icon, title, score }) => (
  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
      {icon}
      <h4 className="font-semibold">{title}</h4>
    </div>
    <p className="text-3xl font-bold mt-2">
      {score}
      <span className="text-xl text-slate-400">/100</span>
    </p>
  </div>
);

function FeedbackPage() {
  const { sessionId } = useParams();
  const { getSessionById } = useSessions();
  const {
    mutate: createStudyPlan,
    data: planContent,
    isPending: isPlanLoading,
  } = useCreateStudyPlan();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const feedbackData = getSessionById(sessionId);

  if (!feedbackData) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const handleCreateStudyPlan = () => {
    if (!feedbackData) return;
    createStudyPlan(feedbackData);
    setIsModalOpen(true);
  };

  const isCommunicationSession = feedbackData.type === "Communication";

  // Safely access the nested scores for communication sessions
  const communicationScores = isCommunicationSession
    ? feedbackData.feedback?.scores
    : null;

  return (
    <div className="container mx-auto max-w-5xl">
      {/* ... (Modal and Header remain the same) */}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Performance Report
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
          An AI-powered breakdown of your {feedbackData.type} session.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="flex flex-col items-center justify-center p-6">
            <CardHeader className="text-center mb-4">
              <CardTitle>Overall Score</CardTitle>
            </CardHeader>
            <RadialProgress score={feedbackData.score} />
          </Card>

          {!isCommunicationSession && (
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <MetricItem
                  icon={<BarChart size={20} className="text-blue-500" />}
                  title="Clarity"
                  value={feedbackData.clarity}
                  unit="%"
                />
                <MetricItem
                  icon={<Annoyed size={20} className="text-orange-500" />}
                  title="Filler Words"
                  value={feedbackData.fillerWords}
                />
                <MetricItem
                  icon={<Wind size={20} className="text-purple-500" />}
                  title="Pace"
                  value={feedbackData.pace}
                  unit="WPM"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-3 space-y-8">
          {!isCommunicationSession && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareQuote /> Your Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-slate dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <blockquote>"{feedbackData.answer}"</blockquote>
              </CardContent>
            </Card>
          )}

          {/* MODIFIED: This section now handles both feedback types */}
          <Card>
            {isCommunicationSession ? (
              <>
                {/* NEW: Display score breakdown for communication sessions */}
                {communicationScores && (
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                    <ScoreCard
                      icon={<BookOpen size={20} />}
                      title="Reading"
                      score={communicationScores.reading}
                    />
                    <ScoreCard
                      icon={<Repeat size={20} />}
                      title="Repetition"
                      score={communicationScores.repetition}
                    />
                    <ScoreCard
                      icon={<BrainCircuit size={20} />}
                      title="Comprehension"
                      score={communicationScores.comprehension}
                    />
                  </CardContent>
                )}
                <CardHeader>
                  <CardTitle>Detailed Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <StructuredReport
                    reportText={feedbackData.feedback?.reportText}
                  />
                </CardContent>
              </>
            ) : (
              <Tabs defaultValue="strengths" className="w-full">
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="strengths">Strengths</TabsTrigger>
                    <TabsTrigger value="improvements">Improvements</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <TabsContent value="strengths" className="px-6 pb-6">
                  <ul className="space-y-3">
                    {feedbackData.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle
                          className="text-green-500 mt-1 flex-shrink-0"
                          size={18}
                        />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="improvements" className="px-6 pb-6">
                  <ul className="space-y-3">
                    {feedbackData.improvements?.map((item, k) => (
                      <li key={k} className="flex items-start gap-3">
                        <XCircle
                          className="text-yellow-500 mt-1 flex-shrink-0"
                          size={18}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            )}
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-16 flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link to="/app/dashboard">
          <Button size="lg" variant="ghost">
            Back to Dashboard
          </Button>
        </Link>
        {/* Only show study plan button for non-communication sessions */}
        {!isCommunicationSession && (
          <Button
            size="lg"
            onClick={handleCreateStudyPlan}
            disabled={isPlanLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 shadow-lg"
          >
            <SparklesIcon className="mr-2 h-5 w-5" />
            {isPlanLoading ? "Creating Plan..." : "Create AI Study Plan"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;
