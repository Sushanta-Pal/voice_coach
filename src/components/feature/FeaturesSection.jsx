import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../common/Card";
import { Mic, Users, BarChart } from "lucide-react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Real-time Speech Analysis",
      description:
        "Get instant feedback on your pacing, filler words, and clarity to sound more confident and professional.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Unlimited Mock Interviews",
      description:
        "Practice with AI interviewers for various roles, from HR questions to complex technical challenges.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Personalized Dashboard",
      description:
        "Track your progress over time with detailed analytics and identify key areas for improvement.",
    },
  ];

  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Stagger the animation for each card
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      id="features"
      className="w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How VoiceCoach Works
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            A simple, three-step process to boost your communication skills.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Decorative dashed line for larger screens */}
          <div
            className="absolute top-16 left-0 hidden h-px w-full -translate-y-1/2 bg-transparent md:block"
            aria-hidden="true"
          >
            <svg width="100%" height="100%">
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                strokeWidth="2"
                strokeDasharray="8, 8"
                className="stroke-slate-300 dark:stroke-slate-700"
              />
            </svg>
          </div>

          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative z-10"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                <CardHeader className="flex flex-col items-center text-center p-6">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-inner">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-blue-500 tracking-widest">
                      STEP {index + 1}
                    </span>
                    <CardTitle className="mt-1 text-xl font-semibold">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center p-6 pt-0">
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
