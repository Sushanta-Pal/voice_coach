import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";
import Button from "../common/Button";
import { Mic, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../common/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null); // State to track hovered link
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  // Effect to handle scroll detection for styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboardClick = () => {
    navigate("/app/dashboard");
  };

  const navLinks = [
    { href: "/", text: "Home" },
    { href: "#features", text: "Features" },
    { href: "#testimonials", text: "Testimonials" },
  ];

  // Animation variants for the mobile menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: "-20%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: "-20%",
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const mobileLinkContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const mobileLinkVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 p-4">
      <motion.nav
        className={`container mx-auto flex items-center justify-between p-3 transition-all duration-300 ease-in-out rounded-xl ${
          isScrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border border-slate-200/50 dark:border-slate-800/50"
            : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Mic className="h-6 w-6 text-blue-500" />
          <span>VoiceCoach</span>
        </Link>

        {/* Desktop Navigation Links */}
        <motion.div
          className="hidden md:flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onMouseLeave={() => setHoveredLink(null)} // Clear hover on leaving the container
        >
          {navLinks.map((link) => (
            <motion.a
              key={link.text}
              href={link.href}
              className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 transition-colors rounded-md relative"
              onMouseEnter={() => setHoveredLink(link.href)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {hoveredLink === link.href && (
                <motion.div
                  layoutId="hover-bg" // This ID links the animation across elements
                  className="absolute inset-0 bg-white/50 dark:bg-slate-700/50 rounded-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.text}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleDashboardClick}>Go to Dashboard</Button>
            </motion.div>
          ) : (
            <>
              <SignInButton mode="modal">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost">Sign In</Button>
                </motion.div>
              </SignInButton>
              <SignUpButton mode="modal">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button>Start Free Trial</Button>
                </motion.div>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden absolute top-0 left-0 w-full h-screen bg-white dark:bg-slate-950 p-6 pt-24 flex flex-col"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.nav
                className="flex flex-col items-center gap-6 text-lg font-medium"
                variants={mobileLinkContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {navLinks.map((link) => (
                  <motion.a
                    key={link.text}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-slate-700 dark:text-slate-300"
                    variants={mobileLinkVariants}
                    whileHover={{ x: 5 }}
                  >
                    {link.text}
                  </motion.a>
                ))}
              </motion.nav>
              <div className="mt-auto flex flex-col items-center gap-4">
                {isSignedIn ? (
                  <Button
                    onClick={() => {
                      handleDashboardClick();
                      setIsOpen(false);
                    }}
                    size="lg"
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="outline" size="lg" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button size="lg" className="w-full">
                        Start Free Trial
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

export default Navbar;
