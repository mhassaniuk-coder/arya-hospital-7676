import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Activity, Shield, Clock, Users, ChevronRight, Check, Star, Zap, Globe, Smartphone, HeartPulse, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const LandingPage = () => {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [0, 1]);
    const y = useTransform(scrollY, [0, 300], [-20, 0]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] font-sans transition-colors duration-300 selection:bg-teal-500 selection:text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-teal-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <img src="/arya-logo.svg" alt="Arya Hospital" className="h-10 w-10 relative z-10" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                Arya Hospital
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            {['Features', 'Testimonials', 'About'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle variant="icon" className="mr-2" />
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden sm:block px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-full shadow-lg shadow-teal-500/25 transition-all hover:-translate-y-0.5 hover:shadow-teal-500/40"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
                    <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "out" }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-medium mb-8 shadow-sm hover:border-teal-500/30 transition-colors">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                                </span>
                                Introducing Omni-Channel Digital Triage AI
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1]">
                                Healthcare <br />
                                <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent animate-gradient-x">
                                    Reimagined
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                                The world's most advanced Hospital Management System.
                                Powered by Gemini AI to predict patient needs, optimize resources, and save lives.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group"
                                >
                                    Launch Platform
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-slate-700 dark:text-white bg-white/90 dark:bg-slate-800/50 backdrop-blur-md border border-slate-300 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:bg-white dark:hover:bg-slate-800/80">
                                    Watch Demo
                                </button>
                            </div>

                            {/* Social Proof */}
                            <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Trusted by Top Healthcare Institutions</p>
                                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                    {['Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'Mount Sinai'].map((name) => (
                                        <span key={name} className="text-xl font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">{name}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section id="features" className="py-32 bg-white dark:bg-[#0B1120] relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Designed for the Future</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            A complete ecosystem of tools that work together seamlessly to power your entire facility.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-6 h-auto lg:h-[800px]">
                        {/* Main Feature - Large */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-3xl p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm hover:border-teal-500/30 transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/20 transition-colors"></div>
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl w-fit mb-6">
                                    <Activity className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI Clinical Decision Support</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                                    Real-time diagnostic assistance powered by advanced LLMs. Reduce errors and improve patient outcomes with instant second opinions.
                                </p>
                                <div className="mt-auto rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl">
                                    <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000" alt="Dashboard" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-3xl p-8 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-500/30 transition-all group"
                        >
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl w-fit mb-4">
                                <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enterprise Security</h3>
                            <p className="text-slate-600 dark:text-slate-400">HIPAA compliant architecture with biometric authentication.</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="col-span-1 md:col-span-2 lg:col-span-1 row-span-1 rounded-3xl p-8 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 hover:border-rose-500/30 transition-all group"
                        >
                            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl w-fit mb-4">
                                <HeartPulse className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Patient Vitals</h3>
                            <p className="text-slate-600 dark:text-slate-400">IoT integration for continuous monitoring of critical patients.</p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-3xl p-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 hover:border-amber-500/30 transition-all group"
                        >
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl w-fit mb-4">
                                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Fast Performance</h3>
                            <p className="text-slate-600 dark:text-slate-400">Optimized for speed with <span className="font-mono text-xs bg-black/5 dark:bg-white/10 px-1 rounded">0.1s</span> load times.</p>
                        </motion.div>

                        {/* Feature 5 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="col-span-1 md:col-span-2 lg:col-span-1 row-span-1 rounded-3xl p-8 bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/30 hover:border-cyan-500/30 transition-all group"
                        >
                            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl w-fit mb-4">
                                <Smartphone className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Mobile First</h3>
                            <p className="text-slate-600 dark:text-slate-400">Responsive design that works on tablets and phones.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section with Glassmorphism */}
            <section className="py-20 bg-slate-50 dark:bg-[#0B1120] border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { number: '500+', label: 'Hospitals Connected', icon: <Globe className="w-5 h-5 mb-2 mx-auto text-teal-500" /> },
                            { number: '1M+', label: 'Patients Managed', icon: <Users className="w-5 h-5 mb-2 mx-auto text-indigo-500" /> },
                            { number: '99.9%', label: 'Uptime Guarantee', icon: <Check className="w-5 h-5 mb-2 mx-auto text-emerald-500" /> },
                            { number: '24/7', label: 'AI Support', icon: <Clock className="w-5 h-5 mb-2 mx-auto text-rose-500" /> },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-6 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-300"
                            >
                                {stat.icon}
                                <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">{stat.number}</div>
                                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 dark:bg-black">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">Ready to modernize your healthcare facility?</h2>
                    <p className="text-slate-300 mb-12 text-xl max-w-2xl mx-auto">
                        Join the revolution in healthcare management. Experience the power of AI-driven operations today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-10 py-5 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-2xl shadow-2xl shadow-teal-500/30 transition-all transform hover:scale-105"
                        >
                            Get Started Now
                        </button>
                        <button
                            className="w-full sm:w-auto px-10 py-5 text-white/80 hover:text-white font-semibold border border-white/20 hover:border-white/50 rounded-2xl transition-all"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-2 md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/arya-logo.svg" alt="Arya Logo" className="h-8 w-8 grayscale opacity-70" />
                            <span className="text-2xl font-bold text-white">Arya Hospital</span>
                        </div>
                        <p className="max-w-sm text-base leading-relaxed text-slate-500">
                            The next generation of Hospital Management Systems.
                            Security, speed, and intelligence built into the core.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Case Studies</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Legal</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-600">
                    <p>© 2026 Arya Hospital HMS. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Lock className="w-4 h-4" />
                        <span>HIPAA Compliant</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
