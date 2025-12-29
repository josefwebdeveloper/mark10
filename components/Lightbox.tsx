import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize, Minimize, Volume2, VolumeX, SkipForward, ListMusic, Music } from 'lucide-react';
import { MediaItem, MediaType } from '../types';
import { MagicParticles } from './MagicParticles';
import { MUSIC_TRACKS } from '../constants';

interface LightboxProps {
  item: MediaItem;
  items: MediaItem[];
  setSelectedItem: (item: MediaItem) => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onNextTrack: () => void;
  onSelectTrack: (index: number) => void;
  currentTrackIndex: number;
  initialIsPlaying?: boolean;
  audioProgress?: number;
}

export const Lightbox: React.FC<LightboxProps> = ({ 
  item, 
  items, 
  setSelectedItem, 
  onClose, 
  onNext, 
  onPrev, 
  isMusicPlaying,
  onToggleMusic,
  onNextTrack,
  onSelectTrack,
  currentTrackIndex,
  initialIsPlaying = false,
  audioProgress = 0
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  
  // 3 seconds per slide
  const autoplayDuration = 3000; 
  const progressIntervalRef = useRef<number | null>(null);

  // Close playlist on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playlistRef.current && !playlistRef.current.contains(event.target as Node)) {
        setIsPlaylistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autoplay Logic
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / autoplayDuration) * 100, 100);
        setProgress(newProgress);

        if (elapsed >= autoplayDuration) {
          const currentIndex = items.findIndex(i => i.id === item.id);
          const nextIndex = (currentIndex + 1) % items.length;
          setSelectedItem(items[nextIndex]);
          
          if (items[nextIndex].type === MediaType.VIDEO) {
              setIsPlaying(false);
          }
          
        } else {
          progressIntervalRef.current = requestAnimationFrame(tick);
        }
      };

      progressIntervalRef.current = requestAnimationFrame(tick);
    } else {
      if (progressIntervalRef.current) cancelAnimationFrame(progressIntervalRef.current);
      setProgress(0);
    }

    return () => {
      if (progressIntervalRef.current) cancelAnimationFrame(progressIntervalRef.current);
    };
  }, [isPlaying, item, items, setSelectedItem]);

  // Reset progress when item changes manually
  useEffect(() => {
    setProgress(0);
  }, [item]);

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setIsPlaying(false);
        onNext();
      }
      if (e.key === 'ArrowLeft') {
        setIsPlaying(false);
        onPrev();
      }
      if (e.key === ' ') { // Spacebar toggle
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Handle Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!mediaContainerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await mediaContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(prev => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl transition-opacity duration-500 animate-in fade-in">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <MagicParticles />
      </div>

      {/* Close Overlay (Clicking background closes) */}
      <div className="absolute inset-0 z-10" onClick={onClose} />

      {/* Universal Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-black/20 hover:bg-black/50 text-white/70 hover:text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:rotate-90 hover:scale-110"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Content Area */}
      <div 
        ref={mediaContainerRef}
        className="relative z-20 w-full h-full flex items-center justify-center group"
      >
           {/* Navigation Arrows (Desktop) */}
           <button 
             onClick={(e) => { e.stopPropagation(); setIsPlaying(false); onPrev(); }}
             className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/20 hover:bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 duration-500"
           >
             <ChevronLeft className="w-8 h-8" />
           </button>

           <button 
             onClick={(e) => { e.stopPropagation(); setIsPlaying(false); onNext(); }}
             className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-black/20 hover:bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 duration-500"
           >
             <ChevronRight className="w-8 h-8" />
           </button>

           {/* Mobile Navigation Areas (Invisible tap zones) */}
           <div className="lg:hidden absolute left-0 top-0 bottom-0 w-1/4 z-30" onClick={(e) => { e.stopPropagation(); setIsPlaying(false); onPrev(); }} />
           <div className="lg:hidden absolute right-0 top-0 bottom-0 w-1/4 z-30" onClick={(e) => { e.stopPropagation(); setIsPlaying(false); onNext(); }} />


           {/* Media Content Wrapper */}
           <div className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center transition-all duration-700">
            {item.type === MediaType.VIDEO ? (
              <video 
                key={item.id} // Force re-render on change
                src={item.url} 
                controls 
                autoPlay 
                // When video plays, slideshow logic in useEffect handles the rest
                onPlay={() => setIsPlaying(false)}
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl outline-none z-20 bg-black animate-in fade-in duration-500"
              />
            ) : (
              <img 
                key={item.id} // Force re-render on change
                src={item.url} 
                alt={item.title} 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl z-20 animate-in fade-in duration-500"
              />
            )}

            {/* Media Controls Bar (Floating at bottom of media) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
               
               {/* Autoplay Button with Progress Ring */}
               <button
                 onClick={handlePlayToggle}
                 className="relative group/play p-3 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md border border-white/10 transition-all text-white"
                 title={isPlaying ? "Pause Slideshow" : "Start Slideshow"}
               >
                 {/* Progress Ring SVG */}
                 <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 36 36">
                   <path
                      className="text-white/10"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    {isPlaying && (
                      <path
                        className="text-indigo-400 transition-all duration-100 ease-linear"
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    )}
                 </svg>
                 {isPlaying ? <Pause className="w-5 h-5 relative z-10" /> : <Play className="w-5 h-5 relative z-10 fill-white" />}
               </button>

               {/* Music Controls Container */}
               <div className="relative" ref={playlistRef}>
                  <div className="flex flex-col bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md border border-white/10 overflow-visible transition-all relative">
                      <div className="flex items-center relative z-10">
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleMusic(); }}
                          className={`p-3 text-white hover:bg-white/10 transition-all ${isMusicPlaying ? 'border-r border-white/10' : ''}`}
                          title={isMusicPlaying ? "Mute Music" : "Play Music"}
                        >
                          {isMusicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        </button>
                        
                        {isMusicPlaying && (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onNextTrack(); }}
                              className="p-3 text-white hover:bg-white/10 transition-all border-r border-white/10"
                              title="Next Track"
                            >
                              <SkipForward className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={(e) => { e.stopPropagation(); setIsPlaylistOpen(!isPlaylistOpen); }}
                              className={`p-3 text-white hover:bg-white/10 transition-all ${isPlaylistOpen ? 'bg-white/20' : ''}`}
                              title="Select Music"
                            >
                              <ListMusic className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                      {/* Audio Progress Bar */}
                      {isMusicPlaying && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20">
                           <div 
                              className="h-full bg-green-400 transition-all duration-300 ease-linear" 
                              style={{ width: `${audioProgress}%` }}
                           />
                        </div>
                      )}
                   </div>

                   {/* Playlist Popup */}
                   {isPlaylistOpen && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-[100]">
                        <div className="py-2 max-h-48 overflow-y-auto">
                            {MUSIC_TRACKS.map((track, i) => (
                              <button
                                key={i}
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    onSelectTrack(i); 
                                    setIsPlaylistOpen(false); 
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                                  i === currentTrackIndex 
                                    ? 'bg-white/10 text-indigo-300' 
                                    : 'text-slate-300 hover:bg-white/5'
                                }`}
                              >
                                <span className="truncate">{track.title}</span>
                                {i === currentTrackIndex && <Music className="w-3 h-3 text-indigo-400 flex-shrink-0 ml-2" />}
                              </button>
                            ))}
                        </div>
                      </div>
                   )}
               </div>

               {/* Fullscreen Button */}
               <button
                 onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                 className="p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110"
                 title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
               >
                 {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
               </button>
            </div>
           </div>
      </div>
    </div>
  );
};