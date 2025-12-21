import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, LayoutDashboard, Users, MessageCircle, Heart, Share2, ShoppingBag, Search } from 'lucide-react';
import Button from '../common/Button';

const HelpModal = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const steps = [
        {
            title: "Welcome to NUST Connect",
            subtitle: "Your Digital Campus Companion",
            description: "NUST Connect was created to bridge the gap between students, faculty, and campus resources. It is a unified platform designed to make your university life easier, more connected, and efficient.",
            icon: <Heart size={64} className="text-white" />,
            color: "from-pink-500 to-rose-500",
            features: ["Unified Platform", "Student-Centric", "Real-time Updates"]
        },
        {
            title: "Your Dashboard Hub",
            subtitle: "Everything at a Glance",
            description: "The Dashboard is your command center. Access Quick Actions for Library, Cafeteria, and more. Track your events, ride sharing status, and academic deadlines all in one beautiful view.",
            icon: <LayoutDashboard size={64} className="text-white" />,
            color: "from-blue-500 to-cyan-500",
            features: ["Quick Actions", "Live Stats", "Event Tracking"]
        },
        {
            title: "Network & Grow",
            subtitle: "Connect, Share, & Explore",
            description: "Build your profile, chat with peers, and explore the marketplace. Use the sidebar to navigate to Ride Sharing, Lost & Found, and more to truly engage with the NUST community.",
            icon: <Users size={64} className="text-white" />,
            color: "from-violet-500 to-purple-500",
            features: ["Messaging", "Marketplace", "Ride Sharing"]
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(curr => curr + 1);
        else onClose();
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(curr => curr - 1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden relative border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-10 dark:bg-white/10 dark:hover:bg-white/20"
                >
                    <X size={20} className="text-slate-600 dark:text-slate-300" />
                </button>

                {/* Content */}
                <div className="flex flex-col h-[500px]">
                    {/* Top Graphic Area */}
                    <div className={`h-1/2 bg-gradient-to-br ${steps[currentStep].color} relative flex items-center justify-center transition-colors duration-500`}>
                        <div className="absolute inset-0 bg-white/10 pattern-dots opacity-20" />

                        {/* Dynamic Floating Icons */}
                        <div className="absolute top-10 left-10 animate-bounce delay-100 opacity-50">
                            {currentStep === 0 && <Share2 className="text-white" size={24} />}
                            {currentStep === 1 && <ShoppingBag className="text-white" size={24} />}
                            {currentStep === 2 && <MessageCircle className="text-white" size={24} />}
                        </div>
                        <div className="absolute bottom-10 right-10 animate-bounce delay-700 opacity-50">
                            {currentStep === 0 && <Search className="text-white" size={24} />}
                            {currentStep === 1 && <Users className="text-white" size={24} />}
                            {currentStep === 2 && <LayoutDashboard className="text-white" size={24} />}
                        </div>

                        {/* Main Icon */}
                        <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md shadow-lg transform transition-transform hover:scale-110 duration-300">
                            {steps[currentStep].icon}
                        </div>
                    </div>

                    {/* Bottom Text Area */}
                    <div className="h-1/2 p-8 flex flex-col justify-between bg-white dark:bg-slate-900">
                        <div>
                            <div className="flex items-center space-x-2 text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">
                                <span>Step {currentStep + 1} of {steps.length}</span>
                                <span className="h-px bg-slate-200 flex-1"></span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{steps[currentStep].title}</h2>
                            <h3 className="text-lg font-medium text-slate-500 mb-4">{steps[currentStep].subtitle}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                {steps[currentStep].description}
                            </p>

                            {/* Features Tags */}
                            <div className="flex space-x-3">
                                {steps[currentStep].features.map((feature, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex space-x-1">
                                {steps.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === currentStep ? 'bg-primary-600 w-6' : 'bg-slate-300'}`}
                                    />
                                ))}
                            </div>

                            <div className="flex space-x-3">
                                {currentStep > 0 && (
                                    <Button onClick={handlePrev} variant="ghost">Back</Button>
                                )}
                                <Button onClick={handleNext} variant="primary" className="rounded-full px-6">
                                    {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                                    {currentStep < steps.length - 1 && <ArrowRight size={16} className="ml-2" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
