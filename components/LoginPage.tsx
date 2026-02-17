import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { Activity, ShieldCheck, UserCircle, Mail, Lock, ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../src/contexts/ThemeContext';

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
      } else if (view === 'register') {
        // Default role for now, or allow selection if backend supports it safely
        // Ideally verification step happens before or after this, but sticking to existing flow structure
        await register(name, email, password, role);
      } else if (view === 'forgot-password') {
        // Simulate API delay for now as backend might not have this yet
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
    <div className="md:w-1/2 bg-teal-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/90 p-2 rounded-xl backdrop-blur-sm shadow-lg">
            <img src="/arya-logo.svg" alt="Arya Hospital" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Arya Hospital</h1>
        </div>
        <div className="space-y-4">
          <p className="text-teal-100 text-lg leading-relaxed">
            Advanced Hospital Management System tailored for modern healthcare facilities. Secure, Efficient, and Reliable.
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">HIPAA Compliant</span>
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">256-bit Encryption</span>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-sm text-teal-200">© 2024 Arya Hospital Systems</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4 font-sans theme-transition relative">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-background-secondary shadow-lg text-foreground-secondary hover:text-accent transition-all z-50 theme-transition"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="max-w-4xl w-full bg-background-secondary rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] theme-transition">

        {renderBrand()}

        {/* Right Side - Forms */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center relative">

          {/* Header */}
          <div className="mb-8">
            {view === 'login' && (
              <>
                <h2 className="text-2xl font-bold text-foreground-primary mb-2">Welcome Back</h2>
                <p className="text-foreground-secondary">Please sign in to access your dashboard.</p>
              </>
            )}
            {view === 'register' && (
              <>
                <h2 className="text-2xl font-bold text-foreground-primary mb-2">Create Account</h2>
                <p className="text-foreground-secondary">Join the medical staff network.</p>
              </>
            )}
            {view === 'forgot-password' && (
              <>
                <button
                  onClick={() => { setView('login'); setResetSent(false); }}
                  className="flex items-center text-sm text-foreground-secondary hover:text-accent mb-4 theme-transition"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back to Login
                </button>
                <h2 className="text-2xl font-bold text-foreground-primary mb-2">Reset Password</h2>
                <p className="text-foreground-secondary">Enter your email to receive recovery instructions.</p>
              </>
            )}
          </div>

          {/* Form Content */}
          {/* Verification Step Removed for Real Auth */}
          {view === 'forgot-password' && resetSent ? (
            <div className="bg-success-light border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-fade-in">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-green-800 dark:text-green-200 font-bold mb-2">Check your email</h3>
              <p className="text-green-600 dark:text-green-300 text-sm mb-6">We've sent password reset instructions to {email}</p>
              <button
                onClick={() => setView('login')}
                className="text-accent font-semibold text-sm hover:underline"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Common Fields */}
              {(view === 'login' || view === 'register') && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-primary mb-2">Full Name</label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Sarah Chen"
                        className="w-full bg-background-primary border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent text-foreground-primary transition-all theme-transition placeholder:text-foreground-muted"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field (All Views) */}
              {(view === 'register' || view === 'forgot-password') && (
                <div>
                  <label className="block text-sm font-semibold text-foreground-primary mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="name@hospital.com"
                      className="w-full bg-background-primary border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent text-foreground-primary transition-all theme-transition placeholder:text-foreground-muted"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              {(view === 'login' || view === 'register') && (
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-semibold text-foreground-primary">Password</label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => setView('forgot-password')}
                        className="text-sm text-accent hover:text-accent/80 font-medium"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
                    <input
                      type="password"
                      required={view === 'register'} // Optional for demo login, required for register
                      placeholder="••••••••"
                      className="w-full bg-background-primary border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent text-foreground-primary transition-all theme-transition placeholder:text-foreground-muted"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Role Selection */}
              {(view === 'login' || view === 'register') && (
                <div>
                  <label className="block text-sm font-semibold text-foreground-primary mb-2">Select Role</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={20} />
                    <select
                      className="w-full bg-background-primary border border-border rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-accent text-foreground-primary transition-all theme-transition appearance-none cursor-pointer"
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                      {Object.values(UserRole).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
