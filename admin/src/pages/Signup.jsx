import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    admin_id: `A${Math.floor(Date.now() / 1000)}`,
    role: 'Admin'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admins/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-[2rem] p-12 shadow-2xl shadow-slate-200/50">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-xl">
            <ShieldPlus size={40} strokeWidth={1.5} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">New Admin</h1>
          <p className="text-slate-400 font-bold text-sm tracking-wide">SHAHANE TECH ACCESS CONTROL</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 text-center uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Admin Name"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@shahane.tech"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
          >
            Create Admin <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8">
          <Link to="/login" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors">Already registered? Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
