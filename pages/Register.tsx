
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, email, password);
    navigate('/upload');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl shadow-indigo-100 border border-slate-100">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create Account</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Join the shopping revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Your Name</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none text-slate-900 font-bold transition-all shadow-inner"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none text-slate-900 font-bold transition-all shadow-inner"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:outline-none text-slate-900 font-bold transition-all shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full prism-gradient text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] transition-all shadow-xl shadow-indigo-200 active:scale-95"
          >
            Get Started
          </button>
        </form>

        <p className="text-center mt-10 text-slate-400 text-sm font-bold">
          Already a member? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
