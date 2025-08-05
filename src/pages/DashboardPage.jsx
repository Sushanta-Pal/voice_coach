import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useSessions } from "../hooks/useSessions";
import { useSummarizeProgress } from "../hooks/useVoiceCoach";
import Button from "../components/common/Button.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/common/Card.jsx";
import Modal from "../components/common/Model.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import ProgressChart from "../components/common/ProgressChart"; // Assuming ProgressChart.jsx is in the same directory

// Import Icons
import {
  Sparkles,
  Code,
  Briefcase,
  Globe,
  BarChart,
  PlusCircle,
  TrendingUp,
  Target,
} from "lucide-react";

// Enhanced EmptyState Component
const EmptyState = () => (
  <div className="mt-8 text-center rounded-2xl bg-white dark:bg-slate-800/50 p-12 shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
      <BarChart className="h-8 w-8 text-blue-500 dark:text-blue-300" />
    </div>
    <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
      Your Journey Starts Here
    </h3>
    <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
      Complete your first session to see your progress and unlock AI insights.
    </p>
    <div className="mt-8">
      <Link to="/app/new-session">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
        >
          <PlusCircle className="mr-2" /> Start First Session
        </Button>
      </Link>
    </div>
  </div>
);

// Enhanced DashboardPage
function DashboardPage() {
  const { user } = useUser();
  const { userData, sessionHistory, isLoading } = useSessions();
  const {
    mutate: summarizeProgress,
    data: summaryContent,
    isPending: isSummaryLoading,
  } = useSummarizeProgress();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  const safeSessionHistory = Array.isArray(sessionHistory)
    ? sessionHistory
    : [];
  const totalSessions = safeSessionHistory.length;
  const avgScore =
    userData && userData.avg_score
      ? parseFloat(userData.avg_score).toFixed(0)
      : 0;

  const handleSummarizeProgress = () => {
    if (totalSessions === 0) return;
    summarizeProgress(safeSessionHistory);
    setIsModalOpen(true);
  };

  const getSessionIcon = (type) => {
    switch (type) {
      case "Technical":
        return <Code className="h-5 w-5 text-slate-500 dark:text-slate-300" />;
      case "HR":
        return (
          <Briefcase className="h-5 w-5 text-slate-500 dark:text-slate-300" />
        );
      case "Communication":
        return <Globe className="h-5 w-5 text-slate-500 dark:text-slate-300" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Modal
          title="AI Progress Summary"
          content={isSummaryLoading ? <LoadingSpinner /> : summaryContent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.firstName || "User"}!
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            {totalSessions > 0
              ? "Here’s a snapshot of your progress. Keep up the great work!"
              : "Let's get started on your interview preparation journey."}
          </p>
        </div>

        {totalSessions === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stat Cards & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Total Sessions</CardTitle>
                  <TrendingUp className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold">{totalSessions}</p>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>Average Score</CardTitle>
                  <Target className="h-5 w-5 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-bold">
                    {avgScore}
                    <span className="text-2xl text-slate-500">/100</span>
                  </p>
                </CardContent>
              </Card>
              <Card className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center bg-slate-100 dark:bg-slate-800/50 p-6 gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Ready for the next step?
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Start a new session or get an AI summary of your journey so
                    far.
                  </p>
                </div>
                <div className="flex-shrink-0 flex sm:flex-col gap-3 w-full sm:w-auto">
                  <Link to="/app/new-session" className="w-full">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:opacity-90 transition-opacity"
                    >
                      <PlusCircle className="mr-2 h-5 w-5" /> New Session
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleSummarizeProgress}
                    disabled={isSummaryLoading}
                    className="w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isSummaryLoading ? "Analyzing..." : "AI Summary"}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Progress Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[26rem]">
                    {/* Use the imported ProgressChart component */}
                    <ProgressChart data={[...safeSessionHistory].reverse()} />
                  </CardContent>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Session History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-2 -mr-2">
                      {safeSessionHistory.map((session) => (
                        <Link
                          to={`/app/feedback/${session.id}`}
                          key={session.id}
                          className="block group"
                        >
                          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 transition-all duration-200 group-hover:bg-slate-200 dark:group-hover:bg-slate-700/60 group-hover:ring-2 group-hover:ring-blue-500">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                {getSessionIcon(session.type)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">
                                  {session.type} Interview
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {session.date}
                                </p>
                              </div>
                            </div>
                            <div className="text-right pl-2">
                              <p className="font-bold text-lg text-slate-700 dark:text-slate-200">
                                {session.score}
                                <span className="text-sm text-slate-500">
                                  /100
                                </span>
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
