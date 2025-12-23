
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import VideoPlayer, { VideoPlayerHandle } from '../components/VideoPlayer';
import ObjectCard from '../components/ObjectCard';
import { detectObjectsInFrame } from '../services/geminiService';
import { DetectedObject } from '../types';

const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<VideoPlayerHandle>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('vl_last_video');
    const type = localStorage.getItem('vl_source_type');
    if (saved) {
      setSourceType(type);
      setVideoUrl(saved);
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  const handleFrameCapture = async (frameBase64: string) => {
    if (sourceType === 'youtube') {
      setError("Note: YouTube videos can't be scanned frame-by-frame currently. Please upload a video file.");
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setHoveredObjectId(null);
    try {
      const results = await detectObjectsInFrame(frameBase64);
      setDetectedObjects(results);
    } catch (err) {
      setError("Search failed. Please try scanning the screen again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!videoUrl) return null;

  const isYouTube = sourceType === 'youtube';

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 min-h-screen">
      <div className="w-full lg:w-[65%] flex flex-col">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
               <nav className="flex items-center space-x-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                 <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                 <span>/</span>
                 <span className="text-slate-900">Current Video</span>
               </nav>
               <div className={`px-4 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center ${isYouTube ? 'border-indigo-100 text-indigo-600 bg-indigo-50' : 'border-emerald-100 text-emerald-600 bg-emerald-50'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isYouTube ? 'bg-indigo-600' : 'bg-emerald-600 animate-pulse'}`}></span>
                  {sourceType === 'local' ? 'Video File' : 'Web Link'}
               </div>
            </div>
            <button onClick={() => navigate('/upload')} className="text-slate-500 hover:text-rose-600 transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
              Close Video
            </button>
          </div>
          
          <VideoPlayer 
            key={videoUrl} 
            ref={playerRef} 
            src={videoUrl} 
            onCapture={handleFrameCapture} 
            onPlay={() => { setDetectedObjects([]); setHoveredObjectId(null); }} 
            detectedObjects={detectedObjects}
            hoveredObjectId={hoveredObjectId}
          />

          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="flex-grow p-5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-start space-x-4">
              <div className={`mt-1 ${isYouTube ? 'text-indigo-600' : 'text-rose-500'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="font-semibold leading-relaxed">
                {isYouTube ? "You're watching a YouTube link. For AI object detection, please upload a direct video file from your computer." : "Pause the video and click 'Scan Scene' to identify products in the current frame."}
              </p>
            </div>
            
            {!isYouTube && (
              <button 
                onClick={() => playerRef.current?.capture()}
                disabled={isAnalyzing}
                className="flex items-center justify-center space-x-3 prism-gradient text-white px-10 py-5 rounded-2xl font-black transition-all shadow-xl shadow-indigo-200 disabled:opacity-30 transform active:scale-95"
              >
                {isAnalyzing ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                )}
                <span className="uppercase tracking-widest text-xs">{isAnalyzing ? 'Analyzing...' : 'Scan Scene'}</span>
              </button>
            )}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 text-sm font-bold flex items-center space-x-3">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[35%]">
        <div className="bg-white rounded-3xl border border-slate-200 flex flex-col h-[calc(100vh-140px)] shadow-lg overflow-hidden sticky top-[100px]">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-sm font-black text-slate-900 flex items-center tracking-wider uppercase">
              <span className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mr-4 shadow-lg shadow-indigo-100">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </span>
              Shopping List
            </h2>
            {detectedObjects.length > 0 && (
              <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {detectedObjects.length} ITEMS
              </span>
            )}
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-2">Analyzing Frame</p>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Identifying products and stores...</p>
                </div>
              </div>
            ) : detectedObjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 opacity-30">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center">
                   <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <p className="text-slate-400 font-black text-xs tracking-widest uppercase">Scan a frame to begin</p>
              </div>
            ) : (
              detectedObjects.map((obj) => (
                <ObjectCard key={obj.id} object={obj} onHover={setHoveredObjectId} />
              ))
            )}
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center justify-between opacity-50">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">AI Engine Active</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VisionX v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
