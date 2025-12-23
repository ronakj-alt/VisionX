
import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { DetectedObject } from '../types';

interface VideoPlayerProps {
  src: string;
  onCapture: (frameBase64: string) => void;
  onPlay: () => void;
  detectedObjects?: DetectedObject[];
  hoveredObjectId?: string | null;
}

export interface VideoPlayerHandle {
  capture: () => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(({ src, onCapture, onPlay, detectedObjects = [], hoveredObjectId }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (videoRef.current && src) {
      setHasError(false);
      videoRef.current.load();
    }
  }, [src]);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && !hasError && video.readyState >= 2) {
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const base64 = dataUrl.split(',')[1];
          onCapture(base64);
        }
      } catch (err) {
        console.error("Capture failed:", err);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    capture: captureFrame
  }));

  const togglePlay = () => {
    const video = videoRef.current;
    if (video && !hasError) {
      if (video.paused) {
        video.play().catch(() => setHasError(true));
        setIsPlaying(true);
        onPlay();
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const seek = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  return (
    <div ref={containerRef} className="relative group overflow-hidden rounded-3xl bg-slate-900 aspect-video flex items-center justify-center shadow-2xl border-4 border-white">
      {hasError ? (
        <div className="flex flex-col items-center justify-center text-slate-900 p-12 text-center bg-white absolute inset-0 z-20">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 border border-rose-100">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-black text-xl mb-2">Video Unavailable</p>
          <p className="text-slate-500 text-xs font-semibold">The video source could not be loaded or played.</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            crossOrigin="anonymous"
            playsInline
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onEnded={() => setIsPlaying(false)}
            onError={() => setHasError(true)}
          />
          
          {!isPlaying && detectedObjects.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {detectedObjects.map((obj) => {
                const isHovered = hoveredObjectId === obj.id;
                return (
                  <div 
                    key={obj.id}
                    className={`absolute border-4 rounded-2xl transition-all duration-300 ${
                      isHovered 
                        ? 'border-rose-500 bg-rose-500/10 z-10 scale-[1.03] shadow-2xl shadow-rose-500/30' 
                        : 'border-indigo-500 bg-indigo-500/5 z-0 shadow-lg shadow-indigo-500/20'
                    }`}
                    style={{
                      top: `${obj.boundingBox.y / 10}%`,
                      left: `${obj.boundingBox.x / 10}%`,
                      width: `${obj.boundingBox.width / 10}%`,
                      height: `${obj.boundingBox.height / 10}%`,
                    }}
                  >
                    {/* Pulsing Scan Effect */}
                    <div className={`absolute top-0 left-0 w-full h-1 animate-prism-scan transition-colors duration-300 ${isHovered ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                    
                    <div className={`absolute -top-10 left-0 px-4 py-1.5 rounded-full whitespace-nowrap text-[10px] font-black shadow-xl transition-all duration-300 ${
                      isHovered ? 'bg-rose-500 text-white scale-110' : 'bg-indigo-600 text-white'
                    }`}>
                      {obj.name.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      
      <canvas ref={canvasRef} className="hidden" />

      {!hasError && (
        <div className={`absolute bottom-0 left-0 right-0 px-8 py-10 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent transition-opacity flex items-center justify-center space-x-6 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); seek(-10); }} 
            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:scale-105 transition-all border border-white/20 shadow-xl"
            title="Rewind 10s"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
            className="w-16 h-16 prism-gradient rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl shadow-indigo-500/40 border-2 border-white/50"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); seek(10); }} 
            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:scale-105 transition-all border border-white/20 shadow-xl"
            title="Forward 10s"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 18l5-6-5-6v12zm9-6c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8 8-3.58 8-8z"/></svg>
          </button>
        </div>
      )}

      <style>{`
        @keyframes prism-scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-prism-scan {
          animation: prism-scan 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

export default VideoPlayer;
