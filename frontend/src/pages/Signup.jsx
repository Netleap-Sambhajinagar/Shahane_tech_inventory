import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState(() => ({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone_number: '',
    user_id: `U${Math.floor(Date.now() / 1000)}`
  }));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
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
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-white border border-slate-100 rounded-3xl p-10 shadow-xl shadow-slate-100/50">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-500 font-medium">Join us and start your wholesale journey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1">First Name</label>
              <input 
                type="text" 
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                placeholder="John"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1">Last Name</label>
              <input 
                type="text" 
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                placeholder="Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="you@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">Phone Number</label>
            <input 
              type="tel" 
              required
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              placeholder="+91 12345 67890"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            Create Account <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
