import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Shield, Clock, Users, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-teal-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <img src="/arya-logo.svg" alt="Arya Hospital" className="h-8 w-8" />
                            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Arya Hospital
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a>
                            <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">About</a>
                            <a href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Testimonials</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-transparent dark:from-teal-900/20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                </span>
                                New: AI-Powered Triage System
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
                                The Future of <br />
                                <span className="bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">Healthcare Management</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Experience the next generation of hospital administration. Integrated AI, predictive analytics, and seamless workflows designed for modern healthcare facilities.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-xl shadow-teal-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Launch Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-xl transition-all hover:-translate-y-1">
                                    View Demo
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-200/20 dark:bg-teal-900/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-cyan-200/20 dark:bg-cyan-900/20 rounded-full blur-3xl -z-10"></div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Intelligent Features</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Powered by advanced Gemini AI, Arya Hospital streamlines every aspect of patient care and administrative operations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Activity className="w-8 h-8 text-teal-500" />,
                                title: "Smart Triage",
                                desc: "AI-assisted patient prioritization based on vitals and symptoms."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-indigo-500" />,
                                title: "Predictive Analytics",
                                desc: "Forecast patient admission rates and resource utilization."
                            },
                            {
                                icon: <Clock className="w-8 h-8 text-rose-500" />,
                                title: "Real-time Monitoring",
                                desc: "Live tracking of bed occupancy, staff availability, and ER status."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-teal-500/50 transition-colors group"
                            >
                                <div className="mb-6 p-3 bg-white dark:bg-slate-800 rounded-xl w-fit shadow-sm group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "98%", label: "Accuracy Rate" },
                            { number: "40%", label: "Time Saved" },
                            { number: "24/7", label: "System Uptime" },
                            { number: "10k+", label: "Patients Served" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.number}</div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-teal-600 dark:bg-teal-900">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your healthcare facility?</h2>
                    <p className="text-teal-100 mb-10 text-lg">Join the hundreds of hospitals already using Arya to deliver better patient outcomes.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-2xl hover:bg-slate-50 transition-colors transform hover:scale-105"
                    >
                        Get Started Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/arya-logo.svg" alt="Arya Logo" className="h-8 w-8 grayscale opacity-70" />
                            <span className="text-xl font-bold text-white">Arya Hospital</span>
                        </div>
                        <p className="max-w-xs text-sm">
                            Advanced Hospital Management System powered by AI.
                            Designed for reliability, speed, and ease of use.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-teal-400">Features</a></li>
                            <li><a href="#" className="hover:text-teal-400">Pricing</a></li>
                            <li><a href="#" className="hover:text-teal-400">API Documentation</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-teal-400">About Us</a></li>
                            <li><a href="#" className="hover:text-teal-400">Careers</a></li>
                            <li><a href="#" className="hover:text-teal-400">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
                    © 2026 Arya Hospital HMS. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
