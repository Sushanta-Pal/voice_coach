import React from 'react';
import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/feature/FeaturesSection';
import TestimonialSection from '../components/testimonial/TestimonialSection';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
    return (
        <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <TestimonialSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;