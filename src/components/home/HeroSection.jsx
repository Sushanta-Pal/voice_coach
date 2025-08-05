import React from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Helper Components for the Trust Badge ---

// StarIcon component for displaying star ratings
const StarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "#FBBF24" : "none"}
    stroke={filled ? "#FBBF24" : "#D1D5DB"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-colors duration-300"
  >
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Avatar component with tooltip
const Avatar = ({ src, alt, name, zIndex }) => (
  <div className="relative group">
    <img
      src={src}
      alt={alt}
      className={`w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 group-hover:border-sky-500 transition-all duration-300 ease-in-out transform group-hover:-translate-y-2`}
      style={{ zIndex }}
    />
    <div className="absolute bottom-full mb-2 w-max bg-slate-800 text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none dark:bg-slate-900">
      {name}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800 dark:border-t-slate-900"></div>
    </div>
  </div>
);

// The Trust Component, adapted for the Hero Section
const TrustComponent = () => {
  const users = [
    {
      src: "/image/sushant.png",
      alt: "User 1",
      name: "Sushanta Pal",
    },
    {
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      alt: "User 2",
      name: "Maria Garcia",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      alt: "User 3",
      name: "James Smith",
    },
    {
      src: "https://randomuser.me/api/portraits/men/75.jpg",
      alt: "User 4",
      name: "David Miller",
    },
  ];

  return (
    <div className="mt-16 flex justify-center">
      <div className="bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-400/20 dark:shadow-slate-900/70 p-4 sm:p-6 flex items-center space-x-4 sm:space-x-6">
        {/* Stacked Avatars */}
        <div className="flex -space-x-5">
          {users.map((user, index) => (
            <Avatar
              key={index}
              src={user.src}
              alt={user.alt}
              name={user.name}
              zIndex={users.length - index}
            />
          ))}
          <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-950 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-sm z-0">
            more
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-slate-300 dark:bg-slate-600/50"></div>

        {/* Rating and Trust Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-1 sm:mb-2">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < 4} />
            ))}
            <p className="text-slate-800 dark:text-slate-200 font-bold text-lg ml-3">
              4.7
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Trusted by{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              100+
            </span>{" "}
            users
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Hero Section Component ---

// Mock Button component for demonstration purposes
const Button = ({ size, variant, className, children }) => {
  const baseStyle =
    "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center";
  const sizeStyle = size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
  const variantStyle =
    variant === "outline"
      ? "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <button
      className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`}
    >
      {children}
    </button>
  );
};

// Mock SignUpButton for demonstration
const SignUpButton = ({ children }) => <div>{children}</div>;

const HeroSection = () => {
  const navigate = useNavigate();
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

  const handleStartPracticingClick = () => {
    navigate("/app/dashboard");
  };

  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 bg-white dark:bg-slate-950 overflow-hidden">
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
                onClick={handleStartPracticingClick}
              >
                Start Practicing Now
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch a Demo
            </Button>
          </motion.div>

          {/* --- Integrated Trust Component --- */}
          <motion.div variants={itemVariants}>
            <TrustComponent />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
