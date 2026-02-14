import React, { useState } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../src/contexts/AuthContext';
import { Activity, ShieldCheck, UserCircle, Mail, Lock, ArrowLeft } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [view, setView] = useState<'login' | 'register' | 'forgot-password'>('login');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [resetSent, setResetSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.join('') === generatedCode) {
      login(name, role);
    } else {
      alert('Invalid verification code');
    }
  };

  const handleSendCode = async () => {
    setIsLoading(true);
    // Simulate sending code
    await new Promise(resolve => setTimeout(resolve, 1500));
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsVerificationStep(true);
    setIsLoading(false);
    // In a real app, this would be sent via email/SMS
    console.log('Verification Code:', code); 
    alert(`Demo Verification Code: ${code}`); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login' || view === 'register') {
       await handleSendCode();
       return;
    }
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (view === 'forgot-password') {
      setResetSent(true);
      setIsLoading(false);
      return;
    }

    if (name.trim()) {
      login(name, role);
    }
    setIsLoading(false);
  };

  const renderBrand = () => (
    <div className="md:w-1/2 bg-teal-600 p-12 flex flex-col justify-between text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover opacity-10"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Activity size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">NexusHealth</h1>
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
        <p className="text-sm text-teal-200">© 2024 NexusHealth Systems</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {renderBrand()}

        {/* Right Side - Forms */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center relative">
          
          {/* Header */}
          <div className="mb-8">
            {view === 'login' && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500">Please sign in to access your dashboard.</p>
              </>
            )}
            {view === 'register' && (
              <>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-500">Join the medical staff network.</p>
              </>
            )}
            {view === 'forgot-password' && (
              <>
                <button 
                  onClick={() => { setView('login'); setResetSent(false); }}
                  className="flex items-center text-sm text-slate-500 hover:text-teal-600 mb-4 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back to Login
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
                <p className="text-slate-500">Enter your email to receive recovery instructions.</p>
              </>
            )}
          </div>

          {/* Verification Step */}
          {isVerificationStep ? (
            <div className="animate-fade-in">
                <button 
                  onClick={() => setIsVerificationStep(false)}
                  className="flex items-center text-sm text-slate-500 hover:text-teal-600 mb-6 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back
                </button>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Required</h2>
                <p className="text-slate-500 mb-8">Please enter the 6-digit code sent to your email/device to continue.</p>
                
                <form onSubmit={handleVerification}>
                    <div className="flex justify-between gap-2 mb-8">
                        {verificationCode.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                className="w-12 h-14 border border-slate-300 rounded-xl text-center text-2xl font-bold text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                                value={digit}
                                onChange={(e) => {
                                    const newCode = [...verificationCode];
                                    newCode[index] = e.target.value;
                                    setVerificationCode(newCode);
                                    if (e.target.value && index < 5) {
                                        const nextInput = document.querySelector(`input[name=code-${index + 1}]`) as HTMLInputElement;
                                        if (nextInput) nextInput.focus();
                                        // Simple auto-focus to next sibling
                                        (e.target as HTMLInputElement).nextElementSibling?.querySelector('input')?.focus(); // This might not work with current structure, let's rely on standard tab or user click for now or improve later if needed. Actually let's use a simpler way.
                                        const form = (e.target as HTMLInputElement).form;
                                        const inputs = Array.from(form?.elements || []).filter(el => el.tagName === 'INPUT');
                                        const next = inputs[inputs.indexOf(e.target as HTMLInputElement) + 1] as HTMLInputElement;
                                        if (next) next.focus();
                                    }
                                }}
                            />
                        ))}
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition-all transform hover:scale-[1.02]"
                    >
                        Verify & Login
                    </button>
                    <p className="text-center mt-4 text-sm text-slate-500">
                        Didn't receive code? <button type="button" onClick={handleSendCode} className="text-teal-600 font-bold hover:underline">Resend</button>
                    </p>
                </form>
            </div>
          ) : view === 'forgot-password' && resetSent ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center animate-fade-in">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-green-600" />
              </div>
              <h3 className="text-green-800 font-bold mb-2">Check your email</h3>
              <p className="text-green-600 text-sm mb-6">We've sent password reset instructions to {email}</p>
              <button 
                onClick={() => setView('login')}
                className="text-teal-600 font-semibold text-sm hover:underline"
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
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Dr. Sarah Chen"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      required
                      placeholder="name@hospital.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
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
                    <label className="block text-sm font-semibold text-slate-700">Password</label>
                    {view === 'login' && (
                      <button 
                        type="button"
                        onClick={() => setView('forgot-password')}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="password" 
                      required={view === 'register'} // Optional for demo login, required for register
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Role Selection */}
              {(view === 'login' || view === 'register') && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Role</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
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
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <button onClick={() => setView('register')} className="text-teal-600 font-bold hover:underline">
                    Sign Up
                  </button>
                </p>
              ) : view === 'register' ? (
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <button onClick={() => setView('login')} className="text-teal-600 font-bold hover:underline">
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
