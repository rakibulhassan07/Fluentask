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

    const solutions = [
        {
            id: 'software',
            title: 'Software Development',
            subtitle: 'Dream it, plan it, launch it',
            description: 'The #1 tool for agile teams is now for all teams. Plan, track, and deliver your biggest ideas together.',
            icon: <MdDashboard className="w-6 h-6" />,
            color: 'blue'
        },
        {
            id: 'project',
            title: 'Project Management',
            subtitle: 'Organize work, deliver results',
            description: 'Keep projects on track with powerful planning tools and real-time collaboration.',
            icon: <BiTargetLock className="w-6 h-6" />,
            color: 'green'
        },
        {
            id: 'team',
            title: 'Team Coordination',
            subtitle: 'Connect and collaborate',
            description: 'Bring teams together with shared goals, clear priorities, and seamless communication.',
            icon: <FaUsers className="w-6 h-6" />,
            color: 'purple'
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
            <div className="bg-gradient-to-b from-blue-50 to-white pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            The new <span className="text-blue-600">Fluentask</span>:<br />
                            <span className="text-3xl md:text-4xl text-gray-700">from teams to dreams</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Transform how your teams collaborate, plan, and deliver exceptional results with our comprehensive task management platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                                Get started for free
                            </button>
                            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                                Watch demo
                            </button>
                        </div>
                    </div>
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
                            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-blue-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Solutions Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                        <div>
                            <div className="flex space-x-1 mb-8">
                                {solutions.map((solution) => (
                                    <button
                                        key={solution.id}
                                        onClick={() => setActiveTab(solution.id)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            activeTab === solution.id
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {solution.title}
                                    </button>
                                ))}
                            </div>
                            
                            {solutions.map((solution) => (
                                activeTab === solution.id && (
                                    <div key={solution.id}>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                            {solution.subtitle}
                                        </h3>
                                        <p className="text-lg text-gray-600 mb-6">
                                            {solution.description}
                                        </p>
                                        <div className="flex space-x-4">
                                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                                Get it free
                                            </button>
                                            <button className="text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center">
                                                Explore features <MdArrowForward className="ml-2 w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-80 flex items-center justify-center">
                            <div className="text-center">
                                <FaLightbulb className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-700 font-medium">Interactive Demo</p>
                                <p className="text-gray-600 text-sm">Coming Soon</p>
                            </div>
                        </div>
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
                            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-6">
                                    {template.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {template.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {template.description}
                                </p>
                                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center">
                                    Try it out <MdArrowForward className="ml-2 w-4 h-4" />
                                </button>
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
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                        Get started for free
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;