import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../utils/api';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { setItemWithEvent } from '../../utils/storage';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiUrl('/api/admins/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setItemWithEvent('adminToken', data.token);
        setItemWithEvent('admin', JSON.stringify(data.admin));
        // Force a page reload to ensure App component re-renders with new auth state
        window.location.href = '/admin';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 md:p-12 shadow-2xl shadow-slate-200/50">
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 bg-slate-900 rounded-3xl text-white shadow-xl">
            <ShieldCheck size={32} className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
          </div>
        </div>
        
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Admin Portal</h1>
          <p className="text-slate-400 font-bold text-xs sm:text-sm tracking-wide">SHAHANE TECH B2B DASHBOARD</p>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400">
                <Mail size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shahane.tech"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400">
                <Lock size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm sm:text-base"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 sm:py-5 bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
          >
            Authorize <ArrowRight size={16} className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center">
          <button 
            onClick={() => navigate('/admin/register')}
            className="text-xs sm:text-sm font-bold text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-slate-900 pb-1"
          >
            Create New Admin Account
          </button>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">SECURE ENV v1.02</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
