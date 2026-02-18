import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { Activity, ShieldCheck, UserCircle, Mail, Lock, ArrowLeft, Zap, CheckCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async (selectedRole: UserRole) => {
    setIsLoading(true);
    try {
      await login('demo@nexushealth.com', 'demo123', selectedRole);
    } catch (error) {
      console.error(error);
      alert('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === 'login') {
        await login(email, password, role);
      } else if (view === 'register') {
        await register(name, email, password, role);
      } else if (view === 'forgot-password') {
        await new Promise(resolve => setTimeout(resolve, 800));
        setResetSent(true);
      }
    } catch (error) {
      console.error(error);
      alert('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderBrand = () => (
    <div className="md:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-800 p-12 flex flex-col justify-between text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover opacity-10 mix-blend-overlay"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/90 p-2.5 rounded-2xl backdrop-blur-md shadow-xl shadow-black/10">
            <img src="/arya-logo.svg" alt="Arya Hospital" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Arya Hospital</h1>
        </div>
        <div className="space-y-6">
          <p className="text-teal-50 text-lg leading-relaxed font-light">
            Experience the future of healthcare management. Secure, efficient, and designed for modern medical facilities.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {['HIPAA Compliant', 'AI-Powered', 'Real-time Analytics', 'Secure Cloud'].map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-10 text-xs text-teal-200/80 font-medium tracking-wide">
        © 2024 ARYA HOSPITAL SYSTEMS • VERSION 2.0
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4 font-sans theme-transition relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] opacity-50 dark:opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] opacity-50 dark:opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <ThemeToggle
        variant="glass"
        size="lg"
        className="absolute top-6 right-6 z-50 shadow-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-5xl w-full bg-white dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] relative z-10"
      >
        {renderBrand()}

        {/* Right Side - Forms */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-slate-50 dark:bg-slate-800/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md mx-auto"
            >
              <div className="mb-8">
                {view === 'login' && (
                  <>
                    <h2 className="text-3xl font-bold text-foreground-primary mb-2">Welcome Back</h2>
                    <p className="text-foreground-secondary text-sm">Please sign in to access your dashboard.</p>
                  </>
                )}
                {view === 'register' && (
                  <>
                    <h2 className="text-3xl font-bold text-foreground-primary mb-2">Create Account</h2>
                    <p className="text-foreground-secondary text-sm">Join the medical staff network.</p>
                  </>
                )}
                {view === 'forgot-password' && (
                  <>
                    <button
                      onClick={() => { setView('login'); setResetSent(false); }}
                      className="flex items-center text-sm text-foreground-secondary hover:text-accent mb-6 transition-colors group"
                    >
                      <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Login
                    </button>
                    <h2 className="text-2xl font-bold text-foreground-primary mb-2">Reset Password</h2>
                    <p className="text-foreground-secondary text-sm">Enter your email to receive recovery instructions.</p>
                  </>
                )}
              </div>

              {view === 'forgot-password' && resetSent ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-foreground-primary font-bold text-lg mb-2">Check your email</h3>
                  <p className="text-foreground-secondary text-sm mb-6">We've sent password reset instructions to <span className="font-semibold text-foreground-primary">{email}</span></p>
                  <button
                    onClick={() => setView('login')}
                    className="text-accent font-bold text-sm hover:underline"
                  >
                    Return to Login
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {(view === 'login' || view === 'register') && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-foreground-secondary uppercase tracking-wider pl-1">Name</label>
                      <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-hover:text-accent transition-colors" size={20} />
                        <input
                          type="text"
                          required={view === 'register'}
                          placeholder="e.g. Dr. Sarah Chen"
                          className="w-full bg-background-tertiary/50 border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-foreground-primary transition-all placeholder:text-foreground-muted/70"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {(view === 'register' || view === 'forgot-password' || view === 'login') && (
                    /* NOTE: Combined email field logic for cleaner TSX, logic check inside */
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-foreground-secondary uppercase tracking-wider pl-1">Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-hover:text-accent transition-colors" size={20} />
                        <input
                          type="email"
                          required
                          placeholder="name@hospital.com"
                          className="w-full bg-background-tertiary/50 border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-foreground-primary transition-all placeholder:text-foreground-muted/70"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {(view === 'login' || view === 'register') && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center pl-1">
                        <label className="block text-xs font-bold text-foreground-secondary uppercase tracking-wider">Password</label>
                        {view === 'login' && (
                          <button
                            type="button"
                            onClick={() => setView('forgot-password')}
                            className="text-xs text-accent hover:text-accent-dark font-semibold transition-colors"
                          >
                            Forgot Password?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-hover:text-accent transition-colors" size={20} />
                        <input
                          type="password"
                          required={view === 'register'}
                          placeholder="••••••••"
                          className="w-full bg-background-tertiary/50 border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-foreground-primary transition-all placeholder:text-foreground-muted/70"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {(view === 'login' || view === 'register') && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-foreground-secondary uppercase tracking-wider pl-1">Role</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-hover:text-accent transition-colors" size={20} />
                        <select
                          className="w-full bg-background-tertiary/50 border border-border rounded-xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-foreground-primary transition-all appearance-none cursor-pointer"
                          value={role}
                          onChange={(e) => setRole(e.target.value as UserRole)}
                        >
                          {Object.values(UserRole).map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-muted">
                          <ArrowLeft className="rotate-[-90deg]" size={12} />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      view === 'login' ? 'Sign In' : (view === 'register' ? 'Create Account' : 'Send Reset Link')
                    )}
                  </button>
                </form>
              )}

              {/* Footer Links */}
              {!resetSent && (
                <div className="mt-8 text-center">
                  {view === 'login' ? (
                    <p className="text-sm text-foreground-secondary">
                      Don't have an account?{' '}
                      <button onClick={() => setView('register')} className="text-accent font-bold hover:underline">
                        Sign Up
                      </button>
                    </p>
                  ) : view === 'register' ? (
                    <p className="text-sm text-foreground-secondary">
                      Already have an account?{' '}
                      <button onClick={() => setView('login')} className="text-accent font-bold hover:underline">
                        Sign In
                      </button>
                    </p>
                  ) : null}
                </div>
              )}

              {/* Demo Mode */}
              {view === 'login' && (
                <div className="mt-8 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 mb-4 justify-center">
                    <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-foreground-primary text-xs font-bold flex items-center gap-2">
                      <Zap size={12} className="text-accent fill-accent" />
                      Quick Demo Access
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(UserRole).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleDemoLogin(r)}
                        disabled={isLoading}
                        className="px-3 py-2.5 text-xs font-bold bg-background-primary border border-border rounded-lg hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all disabled:opacity-50 text-foreground-secondary flex items-center justify-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted group-hover:bg-accent transition-colors"></span>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
