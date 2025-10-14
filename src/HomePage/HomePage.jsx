import React, { useState } from 'react';
import { MdDashboard, MdAssignment, MdPeople, MdTrendingUp, MdArrowForward, MdCheckCircle, MdSpeed, MdIntegrationInstructions } from 'react-icons/md';
import { FaTasks, FaUsers, FaClock, FaChartBar, FaRocket, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('software');
    
    const features = [
        {
            icon: <FaTasks className="w-8 h-8" />,
            title: "Plan & Track",
            description: "Plan, track, and deliver your biggest ideas together with powerful task management."
        },
        {
            icon: <FaUsers className="w-8 h-8" />,
            title: "Team Collaboration",
            description: "Connect teams and consolidate work in one central source of truth."
        },
        {
            icon: <FaRocket className="w-8 h-8" />,
            title: "Agile Delivery",
            description: "Boost productivity with agile workflows and automated processes."
        },
        {
            icon: <FaChartBar className="w-8 h-8" />,
            title: "Real-time Insights",
            description: "Get actionable insights with powerful reporting and analytics."
        }
    ];

    

    const stats = [
        { number: '300,000+', label: 'Companies trust Fluentask' },
        { number: '200+', label: 'Countries worldwide' },
        { number: '80%', label: 'Fortune 500 companies' }
    ];

    const templates = [
        {
            title: 'Scrum',
            description: 'Easily plan, track, and manage work across sprints',
            icon: <FaRocket className="w-8 h-8 text-blue-600" />
        },
        {
            title: 'Bug Tracking',
            description: 'Seamlessly report, track, and prioritize bugs to address development issues',
            icon: <FaShieldAlt className="w-8 h-8 text-red-600" />
        },
        {
            title: 'DevOps',
            description: 'Develop, deploy, and manage applications with an open tools approach',
            icon: <MdIntegrationInstructions className="w-8 h-8 text-green-600" />
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50  overflow-hidden">

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                    <div className="text-center">
                    
                        {/* Main heading with enhanced styling */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 mb-8 leading-tight">
                            The new{" "}
                            <span className="relative">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-blue-700">
                                    Fluentask
                                </span>
                                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transform scale-x-0 animate-pulse"></div>
                            </span>
                            <br />
                            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 block mt-4">
                                from teams to dreams
                            </span>
                        </h1>

                        {/* Enhanced description */}
                        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                            Transform how your teams{" "}
                            <span className="text-blue-600 font-bold">collaborate</span>,{" "}
                            <span className="text-purple-600 font-bold">plan</span>, and{" "}
                            <span className="text-indigo-600 font-bold">deliver</span>{" "}
                            exceptional results with our comprehensive task management platform.
                        </p>

                        {/* Enhanced buttons with more sophisticated styling */}
                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <button className="group relative bg-fuchsia-400 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <span className="relative z-10">Get started for free</span>
                                <MdArrowForward className="inline ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                            </button>
                            <button className="group relative border-2 border-gray-300/50 text-gray-700 px-10 py-5 rounded-2xl text-lg font-bold hover:border-blue-500/70 hover:text-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 bg-white/40 backdrop-blur-xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 to-purple-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"></div>
                                <span className="relative z-10">Watch demo</span>
                                <span className="inline-block ml-3 group-hover:animate-pulse relative z-10 text-xl">▶</span>
                            </button>
                        </div>

                        {/* Trust indicators with enhanced styling */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="group bg-white/30 backdrop-blur-xl rounded-2xl p-8 border border-white/40 shadow-2xl hover:shadow-3xl hover:bg-white/40 transition-all duration-300 hover:-translate-y-2">
                                    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 filter drop-shadow-sm">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                        {stat.label}
                                    </div>
                                    {/* Glass reflection effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 320" className="w-full h-20 fill-current text-white">
                        <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,186.7C960,192,1056,160,1152,133.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Teamwork solutions for high-performing teams
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-3 border border-white/30 relative overflow-hidden hover:bg-white/80">
                                {/* Background gradient overlay with blur */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Glass reflection effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="text-blue-600 mb-6 p-3 bg-blue-50/80 backdrop-blur-sm rounded-xl inline-block group-hover:scale-110 group-hover:bg-blue-100/80 transition-all duration-300 shadow-lg">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                    
                                    {/* Decorative element with blur */}
                                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-blue-100/60 to-blue-200/60 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300 backdrop-blur-sm"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


           

            {/* Templates Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            GET STARTED WITH A TEMPLATE
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {templates.map((template, index) => (
                            <div key={index} className="group bg-white/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 border border-white/40 relative overflow-hidden cursor-pointer hover:bg-white/70">
                                {/* Animated background gradient with blur */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/70 via-white/60 to-blue-50/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                
                                {/* Glass reflection effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                {/* Top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left filter blur-[0.5px]"></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="mb-6 p-4 bg-gray-50/70 backdrop-blur-sm rounded-2xl inline-block group-hover:bg-white/80 group-hover:shadow-xl group-hover:backdrop-blur-lg transition-all duration-300 group-hover:scale-110">
                                        {template.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                                        {template.title}
                                    </h3>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        {template.description}
                                    </p>
                                    <button className="text-blue-600 font-bold hover:text-blue-700 transition-all duration-300 flex items-center group/btn relative">
                                        <span className="relative z-10">Try it out</span>
                                        <MdArrowForward className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-blue-50/80 backdrop-blur-sm rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-0 scale-110"></div>
                                    </button>
                                    
                                    {/* Decorative elements with blur */}
                                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-100/60 to-purple-100/60 rounded-full opacity-30 group-hover:opacity-50 transition-all duration-500 group-hover:scale-125 backdrop-blur-sm"></div>
                                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-tr from-green-100/60 to-blue-100/60 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110 backdrop-blur-sm"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Unleash the power of teamwork
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join millions teaming up on their best work
                    </p>
                    <button className="group bg-fuchsia-400 text-white px-12 py-5 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden">
                        <span className="relative z-10">Get started for free</span>
                        <MdArrowForward className="inline ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;