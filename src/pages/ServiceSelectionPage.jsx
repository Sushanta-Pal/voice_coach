import React from "react";
import { useNavigate } from "react-router-dom";
import { useSessions } from "../hooks/useSessions";

// Import reusable UI components and icons
import Button from "../components/common/Button.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/common/Card.jsx";
import { CodeIcon, TieIcon, GlobeIcon } from "../components/icons/index.jsx";

/**
 * A redesigned, dynamic page for selecting the type of practice session,
 * featuring an eye-pleasing UI with full support for light and dark modes.
 */
function ServiceSelectionPage() {
  const navigate = useNavigate();
  const { setSessionType } = useSessions();

  // Service definitions with theme-aware and enhanced styling
  const services = [
    {
      type: "Technical",
      title: "Technical Interview",
      // Enhanced icon styling for better visibility and hover feedback
      icon: (
        <CodeIcon className="h-10 w-10 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
      ),
      description:
        "Sharpen your skills on algorithms, data structures, and system design.",
      path: "/app/practice",
    },
    {
      type: "HR",
      title: "HR & Behavioral",
      // Consistent icon styling across standard cards
      icon: (
        <TieIcon className="h-10 w-10 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors duration-300" />
      ),
      description:
        "Master the art of answering behavioral questions with the STAR method.",
      path: "/app/practice",
    },
    {
      type: "Communication",
      title: "Communication Assessment", // Title updated for clarity
      // Icon is now styled to adapt to the featured card's light/dark themes
      icon: (
        <GlobeIcon className="h-12 w-12 text-blue-500 dark:text-teal-400" />
      ),
      description:
        "Improve your clarity, confidence, and professional articulation for any scenario.",
      path: "/app/communication-practice",
    },
  ];

  const standardServices = services.slice(0, 2);
  const featuredService = services[2];

  /**
   * Handles the selection of a service.
   * (No change to logic)
   */
  const handleSelectService = (service) => {
    setSessionType(service.type);
    navigate(service.path);
  };

  return (
    // The main container now has a pleasant background for both themes
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-5xl">
        {/* Page Header with more impactful typography */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Arena
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
            Select a category to begin your personalized coaching session.
          </p>
        </div>

        {/* Standard Service Cards with improved hover effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {standardServices.map((service) => (
            <div
              key={service.type}
              className="group relative cursor-pointer"
              onClick={() => handleSelectService(service)}
            >
              <Card className="h-full bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out group-hover:border-blue-500/50 group-hover:shadow-xl group-hover:-translate-y-2">
                <CardHeader className="items-center text-center">
                  {service.icon}
                  <CardTitle className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-100">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-6 min-h-[48px]">
                    {service.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors duration-300"
                  >
                    Select
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Featured Service Card - completely redesigned for visual appeal and theming */}
        <div
          className="group relative cursor-pointer"
          onClick={() => handleSelectService(featuredService)}
        >
          {/* Enhanced glowing border effect that works in both themes */}
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-300"></div>

          <Card className="relative h-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-black text-slate-900 dark:text-white overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 rounded-lg shadow-lg">
            <div className="flex-shrink-0">{featuredService.icon}</div>
            <div className="text-center md:text-left flex-grow">
              <h3 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent">
                {featuredService.title}
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl">
                {featuredService.description}
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-auto flex-shrink-0">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-teal-500 text-white font-semibold shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Start Assessment
              </Button>
            </div>
          </Card>
        </div>

        {/* Back to Dashboard Button with improved hover state */}
        <div className="text-center mt-16">
          <Button
            variant="ghost"
            onClick={() => navigate("/app/dashboard")}
            className="text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServiceSelectionPage;
