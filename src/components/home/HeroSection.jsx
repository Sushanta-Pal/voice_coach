import React from "react";
import { SignUpButton } from "@clerk/clerk-react";
import Button from "../common/Button";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

const HeroSection = () => {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 bg-white dark:bg-slate-950 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <motion.div
          className="absolute top-[10%] left-[5%] w-32 h-32 bg-blue-300 rounded-full filter blur-2xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[10%] w-40 h-40 bg-teal-300 rounded-full filter blur-2xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-[25%] right-[20%] w-24 h-24 bg-purple-300 rounded-full filter blur-xl"
          animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-teal-400 text-transparent bg-clip-text"
            variants={itemVariants}
          >
            Ace Your Next Interview with AI
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8"
            variants={itemVariants}
          >
            VoiceCoach analyzes your speech, prepares you for technical & HR
            rounds, and gives you the confidence to land your dream job.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
              >
                Start Practicing Now
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch a Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
