import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaTasks, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <FaTasks className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold">Fluentask</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Transform how your teams collaborate, plan, and deliver exceptional results with our comprehensive task management platform.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <FaGithub className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/features" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link to="/integrations" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link to="/templates" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Templates
                                </Link>
                            </li>
                            <li>
                                <Link to="/api" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    API Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/press" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Press
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 mb-6">
                            <li>
                                <Link to="/help" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="/documentation" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link to="/community" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link to="/status" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    System Status
                                </Link>
                            </li>
                        </ul>
                        
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-400 text-sm">
                                <MdEmail className="w-4 h-4 mr-2" />
                                support@fluentask.com
                            </div>
                            <div className="flex items-center text-gray-400 text-sm">
                                <MdPhone className="w-4 h-4 mr-2" />
                                +1 (555) 123-4567
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Fluentask. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;