import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '../hooks/useSessions';

// Import reusable UI components and icons
import Button from '../components/common/Button.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card.jsx';
import { CodeIcon, TieIcon, GlobeIcon } from '../components/icons/index.jsx';

/**
 * A redesigned, dynamic page for selecting the type of practice session.
 */
function ServiceSelectionPage() {
    const navigate = useNavigate();
    const { setSessionType } = useSessions();

    const services = [
        {
            type: 'Technical',
            title: 'Technical Interview',
            icon: <CodeIcon className="h-8 w-8 text-slate-500 group-hover:text-blue-500 transition-colors" />,
            description: 'Sharpen your skills on algorithms, data structures, and system design.',
            path: '/app/practice'
        },
        {
            type: 'HR',
            title: 'HR & Behavioral',
            icon: <TieIcon className="h-8 w-8 text-slate-500 group-hover:text-blue-500 transition-colors" />,
            description: 'Master the art of answering behavioral questions with the STAR method.',
            path: '/app/practice'
        },
        {
            type: 'Communication', // Renamed from 'English'
            title: 'Communication Coach',
            icon: <GlobeIcon className="h-10 w-10 text-white/80 group-hover:text-white transition-colors" />,
            description: 'Improve your clarity, confidence, and professional articulation for any scenario.',
            path: '/app/communication-practice' // New navigation path
        },
    ];

    const standardServices = services.slice(0, 2);
    const featuredService = services[2];

    /**
     * Handles the selection of a service.
     */
    const handleSelectService = (service) => {
        setSessionType(service.type);
        navigate(service.path);
    };

    return (
        <div className="container mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-slate-900 dark:text-white">Choose Your Arena</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">Select a category to begin your personalized coaching session.</p>
            </div>

            {/* Standard Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {standardServices.map(service => (
                    <div key={service.type} className="group relative cursor-pointer" onClick={() => handleSelectService(service)}>
                        <Card className="h-full group-hover:border-blue-500/50 transition-all duration-300">
                            <CardHeader>
                                {service.icon}
                                <CardTitle className="mt-4 text-xl">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">{service.description}</p>
                                <Button variant="outline" className="w-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    Select
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Featured Service Card */}
            <div className="group relative cursor-pointer" onClick={() => handleSelectService(featuredService)}>
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <Card className="relative h-full bg-slate-900 text-white overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                        {featuredService.icon}
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold tracking-tight">{featuredService.title}</h3>
                        <p className="mt-2 text-slate-300 max-w-2xl">{featuredService.description}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-auto">
                        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-200">
                           Go for  Communication Test
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Back to Dashboard Button */}
            <div className="text-center mt-16">
                <Button variant="ghost" onClick={() => navigate('/app/dashboard')}>
                    ← Back to Dashboard
                </Button>
            </div>
        </div>
    );
}

export default ServiceSelectionPage;
