
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white min-h-[calc(100vh-80px)]">
      {/* Visual Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 -skew-x-12 translate-x-1/4 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full mb-8 font-bold text-xs uppercase tracking-wider border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span>AI-Powered Shopping Discovery</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
            Shop Everything <br />
            <span className="prism-text">You See.</span>
          </h1>
          
          <p className="max-w-xl text-lg text-slate-500 font-medium mb-12 leading-relaxed mx-auto lg:mx-0">
            Pause any video and instantly find where to buy the clothes, gadgets, and furniture on screen. No searching required—just tap and shop.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            {user ? (
              <Link 
                to="/upload" 
                className="px-10 py-5 prism-gradient text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-indigo-200"
              >
                Scan a Video
              </Link>
            ) : (
              <>
                <Link 
                  to="/register" 
                  className="px-10 py-5 prism-gradient text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-indigo-200"
                >
                  Get Started Free
                </Link>
                <Link 
                  to="/login" 
                  className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black text-lg hover:border-indigo-600 transition-all shadow-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl relative">
          {/* Main Hero Image Container */}
          <div className="relative group">
            {/* Background Glow */}
            <div className="absolute -inset-10 prism-gradient rounded-full blur-[80px] opacity-20 animate-pulse"></div>
            
            {/* Layer 1: Main Video Frame */}
            <div className="relative bg-white p-3 rounded-[3rem] shadow-2xl border border-slate-100 transform -rotate-2 group-hover:rotate-0 transition-all duration-700">
              <div className="rounded-[2.2rem] overflow-hidden aspect-[4/5] bg-slate-100 relative shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                  alt="Fashion Discovery"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Scanning Laser Line */}
                <div className="absolute top-0 left-0 w-full h-1 prism-gradient shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-line z-20"></div>
              </div>
            </div>

            {/* Layer 2: Pop-out Product Card (Floating Right) */}
            <div className="absolute -right-8 top-1/4 w-48 bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white z-30 animate-float-x transform transition-transform hover:scale-110">
               <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3 border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Heels" />
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Identified</p>
                  <p className="text-xs font-black text-slate-900 leading-tight">Leather Heels</p>
                  <p className="text-[10px] font-bold text-indigo-600">₹4,299 • Myntra</p>
               </div>
               <div className="mt-3 flex space-x-1">
                  <div className="h-1 flex-1 bg-indigo-600 rounded-full"></div>
                  <div className="h-1 flex-1 bg-indigo-200 rounded-full"></div>
                  <div className="h-1 flex-1 bg-indigo-100 rounded-full"></div>
               </div>
            </div>

            {/* Layer 3: Pop-out Product Card (Floating Left) */}
            <div className="absolute -left-12 bottom-1/4 w-44 bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white z-30 animate-float-y-reverse transform transition-transform hover:scale-110">
               <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 leading-none">96% Match</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Handbag</p>
                  </div>
               </div>
               <div className="aspect-[4/3] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                  <img src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover" alt="Bag" />
               </div>
               <div className="mt-3 text-center">
                  <span className="text-[10px] font-black text-white bg-slate-900 px-3 py-1 rounded-full uppercase tracking-tighter">View Deal</span>
               </div>
            </div>

            {/* AI Anchor Dots */}
            <div className="absolute top-[35%] left-[20%] w-4 h-4 z-40">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 border-2 border-white shadow-lg"></span>
            </div>
            <div className="absolute bottom-[25%] right-[35%] w-4 h-4 z-40">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white shadow-lg"></span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 3s ease-in-out infinite;
        }
        @keyframes float-x {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10px, -15px) rotate(2deg); }
        }
        .animate-float-x {
          animation: float-x 5s ease-in-out infinite;
        }
        @keyframes float-y-reverse {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-10px, 15px) rotate(-2deg); }
        }
        .animate-float-y-reverse {
          animation: float-y-reverse 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
