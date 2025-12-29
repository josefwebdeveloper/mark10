import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_MEDIA, APP_SUBTITLE, MUSIC_TRACKS } from './constants';
import { Gallery } from './components/Gallery';
import { Lightbox } from './components/Lightbox';
import { MagicParticles } from './components/MagicParticles';
import { MouseFire } from './components/MouseFire';
import { MediaItem, MediaType } from './types';
import { Camera, Music, VolumeX, Maximize, Minimize, Play, Calendar, ExternalLink, SkipForward, ListMusic, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  
  // User's intent to have music on
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  // Actual playing state (for UI feedback)
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);
  const [startWithAutoplay, setStartWithAutoplay] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const playlistRef = useRef<HTMLDivElement>(null);
  
  // Initialize Audio Object Immediately
  const audioRef = useRef<HTMLAudioElement>(new Audio(MUSIC_TRACKS[0].url));

  // Initialize Audio Listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    // Configure initial state
    audio.loop = true;
    audio.volume = 0.5;
    audio.crossOrigin = "anonymous"; 

    const updateProgress = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const handleEnded = () => {
       // Loop takes care of it
    };

    const handleError = (e: Event) => {
      console.error("Audio Playback Error:", e);
      setIsPlaying(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Handle Play/Pause Logic when state changes
  useEffect(() => {
    const audio = audioRef.current;
    
    // Logic: Music must be enabled globally AND (no item selected OR selected item is NOT a video)
    const shouldPlay = isMusicEnabled && (!selectedItem || selectedItem.type !== MediaType.VIDEO);

    if (shouldPlay) {
      if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Play failed (likely needs user interaction first):", error);
            // We don't turn off isMusicEnabled here, as the user might click 'play' later
          });
        }
      }
    } else {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isMusicEnabled, selectedItem]);

  // Handle Track Source Changes separately to avoid race conditions
  useEffect(() => {
     const audio = audioRef.current;
     const targetUrl = MUSIC_TRACKS[currentTrackIndex].url;
     if (audio.src !== targetUrl) {
        // If we are just changing the track but music is off, just set src
        const wasPlaying = !audio.paused;
        audio.src = targetUrl;
        audio.load();
        if (wasPlaying) audio.play().catch(e => console.error(e));
     }
  }, [currentTrackIndex]);

  // Click outside playlist to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playlistRef.current && !playlistRef.current.contains(event.target as Node)) {
        setIsPlaylistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Direct User Interaction Handlers - Critical for Browser Autoplay Policy
  const toggleMusic = () => {
    const newState = !isMusicEnabled;
    setIsMusicEnabled(newState);
    
    // Direct interaction
    if (newState) {
       audioRef.current.play().catch(e => console.error("Toggle play failed", e));
    } else {
       audioRef.current.pause();
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    // Note: The Effect will handle source change, but we want to ensure it plays if enabled
    if (isMusicEnabled) {
       // We can't synchronously play the *next* url here easily because the state update hasn't propagated to the Effect yet.
       // However, since the user clicked, the 'play' permission is granted.
       // The Effect will pick it up.
    }
  };

  const selectTrack = (index: number) => {
    // Immediate feedback
    setCurrentTrackIndex(index);
    setIsMusicEnabled(true);
    setIsPlaylistOpen(false);

    // Direct audio manipulation to ensure response to click
    const audio = audioRef.current;
    audio.src = MUSIC_TRACKS[index].url;
    audio.load();
    audio.play().catch(e => console.error("Select track play failed", e));
  };

  const toggleAppFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsAppFullscreen(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsAppFullscreen(false);
      }
    }
  };

  const handleStartSlideshow = () => {
    // User explicitly clicked "Play"
    if (INITIAL_MEDIA.length > 0) {
      setIsMusicEnabled(true); 
      setStartWithAutoplay(true);
      setSelectedItem(INITIAL_MEDIA[0]);
      
      // Force play
      audioRef.current.play().catch(e => console.error("Slideshow start play failed", e));
    }
  };

  const handleGalleryItemClick = (item: MediaItem) => {
    setStartWithAutoplay(false);
    setSelectedItem(item);
  };

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = INITIAL_MEDIA.findIndex(i => i.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % INITIAL_MEDIA.length;
    setSelectedItem(INITIAL_MEDIA[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedItem) return;
    const currentIndex = INITIAL_MEDIA.findIndex(i => i.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + INITIAL_MEDIA.length) % INITIAL_MEDIA.length;
    setSelectedItem(INITIAL_MEDIA[prevIndex]);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center pb-20">
      {/* Global Background Particles & Fire Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MagicParticles />
        <MouseFire />
      </div>

      {/* Navbar - Improved Mobile Responsiveness */}
      <nav className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight font-playfair">WonderLens</span>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Play Button */}
          <button 
            onClick={handleStartSlideshow}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all border border-indigo-400 text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] active:scale-95 group"
            aria-label="Start slideshow"
          >
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-white">Play</span>
          </button>

          <div className="h-5 sm:h-6 w-px bg-slate-700 mx-0.5 sm:mx-1"></div>

          {/* Music Control Group - Compact on Mobile */}
          <div className="relative" ref={playlistRef}>
            <div className="flex flex-col bg-slate-800 rounded-full border border-slate-700 overflow-visible relative z-50">
              <div className="flex items-center p-0.5 z-10 relative">
                <button 
                  onClick={toggleMusic}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full hover:bg-slate-700 transition-colors text-xs sm:text-sm font-medium ${isMusicEnabled ? 'text-green-400' : 'text-slate-400'}`}
                  title={isMusicEnabled ? "Turn Off Music" : "Turn On Music"}
                  aria-label={isMusicEnabled ? "Turn Off Music" : "Turn On Music"}
                >
                  {isMusicEnabled ? <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
                
                <div className="h-3 sm:h-4 w-px bg-slate-700 mx-0.5 sm:mx-1"></div>

                <div className="px-1.5 sm:px-2 text-[10px] sm:text-xs text-slate-300 max-w-[60px] sm:max-w-[100px] truncate select-none">
                  {MUSIC_TRACKS[currentTrackIndex].title}
                </div>

                <button 
                  onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                  className={`p-1 sm:p-1.5 rounded-full transition-colors ${isPlaylistOpen ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  title="Select Music"
                  aria-label="Select Music Track"
                  aria-expanded={isPlaylistOpen}
                >
                  <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              
              {/* Progress Bar */}
              {isMusicEnabled && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-slate-700 w-full overflow-hidden rounded-b-full">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300 ease-linear"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Playlist Dropdown - Better Mobile Positioning */}
            {isPlaylistOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right max-h-[60vh] overflow-y-auto">
                <div className="py-2">
                   <div className="px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Track</div>
                   {MUSIC_TRACKS.map((track, i) => (
                     <button
                       key={i}
                       onClick={(e) => {
                         e.stopPropagation(); 
                         selectTrack(i);
                       }}
                       className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                         i === currentTrackIndex 
                           ? 'bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-500' 
                           : 'text-slate-300 hover:bg-white/5 border-l-2 border-transparent'
                       }`}
                     >
                       <span className="truncate pr-2">{track.title}</span>
                       {i === currentTrackIndex && <Music className="w-3 h-3 text-indigo-400 flex-shrink-0" />}
                     </button>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Button - Hidden on very small screens */}
          <button 
            onClick={toggleAppFullscreen}
            className="hidden xs:flex p-1.5 sm:p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
             {isAppFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
          </button>
        </div>
      </nav>

      {/* Premium Glass Hero Section - Improved Mobile */}
      <header className="relative w-full max-w-5xl mx-auto px-3 sm:px-6 pt-8 sm:pt-12 pb-12 sm:pb-20 flex flex-col items-center z-10">
        
        {/* Glass Card Container */}
        <div className="relative w-full p-6 sm:p-8 md:p-14 rounded-3xl sm:rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden group hover:border-white/20 transition-all duration-700">
          
          {/* Subtle Ambient Glows inside card */}
          <div className="absolute -top-20 -left-20 w-40 sm:w-64 h-40 sm:h-64 bg-indigo-500/20 rounded-full blur-[60px] sm:blur-[80px] group-hover:bg-indigo-500/30 transition-all duration-1000"></div>
          <div className="absolute -bottom-20 -right-20 w-40 sm:w-64 h-40 sm:h-64 bg-amber-500/10 rounded-full blur-[60px] sm:blur-[80px] group-hover:bg-amber-500/20 transition-all duration-1000"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-200/90 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-6 sm:mb-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-white/10 transition-colors cursor-default">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
              <span>{APP_SUBTITLE}</span>
            </div>

            {/* Main Heading - Responsive Text Sizes */}
            <h1 className="font-playfair text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 sm:mb-8 leading-[1.1] text-white drop-shadow-xl animate-fade-up">
              Happy Birthday, <br/>
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-[length:200%_auto] animate-[shine_3s_linear_infinite]">Mark!</span>
            </h1>

            {/* Divider */}
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-5 sm:mb-8"></div>

            {/* Subtitle - Responsive Text */}
            <p className="font-sans text-base sm:text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-light tracking-wide animate-fade-up px-4" style={{ animationDelay: '0.2s' }}>
              You are 10 years old. Be happy. We love you.
            </p>

            {/* CSS Heart with Effects */}
            <div className="relative mt-6 sm:mt-10 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="heart-container">
                <div className="heart"></div>
                <div className="heart-shadow"></div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Gallery */}
      <main className="w-full max-w-7xl mx-auto px-6 animate-fade-up z-10 relative" style={{ animationDelay: '0.4s' }}>
        <Gallery items={INITIAL_MEDIA} onItemClick={handleGalleryItemClick} />
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-8 flex justify-center items-center z-10 relative opacity-0 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        <a 
          href="https://porqa.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/30 hover:bg-slate-800/50 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm"
        >
          <span className="text-xs font-medium text-slate-500 group-hover:text-indigo-300 tracking-widest uppercase transition-colors">Designed by Porqa Studio</span>
          <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors" />
        </a>
      </footer>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Lightbox 
          item={selectedItem} 
          items={INITIAL_MEDIA}
          setSelectedItem={setSelectedItem}
          initialIsPlaying={startWithAutoplay}
          isMusicPlaying={isMusicEnabled} 
          onToggleMusic={toggleMusic}
          onNextTrack={nextTrack}
          onSelectTrack={selectTrack}
          currentTrackIndex={currentTrackIndex}
          onClose={() => setSelectedItem(null)}
          onNext={handleNext}
          onPrev={handlePrev} 
          audioProgress={audioProgress}
        />
      )}
    </div>
  );
};

export default App;