
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const UploadVideo = () => {
  const [sourceType, setSourceType] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isYoutubeUrl, setIsYoutubeUrl] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    setIsYoutubeUrl(ytRegex.test(url.trim()));
  }, [url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("File size exceeds 100MB. Please choose a smaller video.");
        return;
      }
      
      setIsProcessing(true);
      setError(null);
      
      const videoUrl = URL.createObjectURL(file);
      localStorage.setItem('vl_last_video', videoUrl);
      localStorage.setItem('vl_source_type', 'local');
      
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/dashboard');
      }, 1200);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (isYoutubeUrl) localStorage.setItem('vl_source_type', 'youtube');
    else localStorage.setItem('vl_source_type', 'direct');

    localStorage.setItem('vl_last_video', url.trim());
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 min-h-screen">
      <div className="mb-10">
        <Link to="/" className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center text-xs font-bold uppercase tracking-widest">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl">
        <div className="p-8 md:p-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Upload Your Video</h1>
            <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto leading-relaxed">Select a video file from your computer or paste a link to start scanning for products.</p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="inline-flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
              <button 
                onClick={() => { setSourceType('file'); setError(null); }}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${sourceType === 'file' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                <span>Local File</span>
              </button>
              <button 
                onClick={() => { setSourceType('url'); setError(null); }}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${sourceType === 'url' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <span>Paste Link</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl flex items-center space-x-3 text-sm font-bold">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {sourceType === 'file' ? (
            <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-24 text-center hover:border-indigo-600/30 hover:bg-slate-50 transition-all cursor-pointer group relative">
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-indigo-100/50">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Drop Video Here</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Maximum size: 100MB (MP4, MOV)</p>
              
              {isProcessing && (
                <div className="mt-12 max-w-xs mx-auto text-center">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4 shadow-inner">
                    <div className="prism-gradient h-full animate-pulse" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Initializing AI Workspace...</span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit} className="space-y-10">
              <div className="relative">
                <label className="block text-xs font-black text-slate-400 mb-4 uppercase tracking-widest ml-1">Video Source URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    {isYoutubeUrl ? (
                      <svg className="h-6 w-6 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/></svg>
                    ) : (
                      <svg className="h-6 w-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    )}
                  </div>
                  <input 
                    type="text"
                    placeholder="Paste YouTube or MP4 link here"
                    className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:border-indigo-600 focus:outline-none text-slate-900 font-bold text-lg placeholder:text-slate-300 transition-all shadow-inner"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={!url}
                className="w-full py-6 rounded-[1.5rem] font-black text-lg uppercase tracking-widest transition-all prism-gradient text-white shadow-2xl shadow-indigo-200 transform active:scale-95 disabled:opacity-30"
              >
                Start Analysis
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
