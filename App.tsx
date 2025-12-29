import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_MEDIA, APP_SUBTITLE, MUSIC_TRACKS } from './constants';
import { Gallery } from './components/Gallery';
import { Lightbox } from './components/Lightbox';
import { MagicParticles } from './components/MagicParticles';
import { MediaItem, MediaType } from './types';
import { Camera, Music, VolumeX, Maximize, Minimize, Play, Calendar, ExternalLink, SkipForward, ListMusic } from 'lucide-react';

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  
  // User's intent to have music on
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  // Actual playing state (derived/managed)
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isAppFullscreen, setIsAppFullscreen] = useState(false);
  const [startWithAutoplay, setStartWithAutoplay] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const playlistRef = useRef<HTMLDivElement>(null);
  
  // Use a stable instance of the Audio object
  const [audio] = useState(() => {
    const a = new Audio(MUSIC_TRACKS[0].url);
    a.loop = true;
    a.volume = 0.5;
    return a;
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audio]);

  // Handle Audio Events (Progress & End)
  useEffect(() => {
    const updateProgress = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    // When song ends, play next automatically if looping playlist behavior is desired, 
    // but here we have a.loop=true for single track looping or manual next.
    // Let's make it auto-advance for a "playlist" feel.
    const handleEnded = () => {
       if (audio.loop) return; // If loop is true, it won't fire 'ended' usually.
       // If we want playlist behavior, we should set loop=false and handle next here.
       // For now, let's keep simple looping track or user manual switch.
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  // Handle Track Source Changes
  useEffect(() => {
    const wasPlaying = isPlaying;
    audio.src = MUSIC_TRACKS[currentTrackIndex].url;
    audio.currentTime = 0;
    if (wasPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrackIndex, audio]);

  // Master Playback Logic: Combines User Intent + Context (Video vs Photo)
  useEffect(() => {
    // If user wants music OFF, it's OFF.
    // If user wants music ON:
    //   - If viewing a VIDEO: Pause (Smart Ducking)
    //   - Otherwise: Play
    const shouldPlay = isMusicEnabled && (!selectedItem || selectedItem.type !== MediaType.VIDEO);

    if (shouldPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Auto-play prevented:", error);
            setIsPlaying(false);
            // If autoplay is blocked, we might want to update intent, but better to leave it 
            // so it resumes when user interacts.
          });
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [isMusicEnabled, selectedItem, audio]);

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

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsMusicEnabled(true);
    setIsPlaylistOpen(false);
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
    if (INITIAL_MEDIA.length > 0) {
      if (!isMusicEnabled) setIsMusicEnabled(true);
      
      // Open Lightbox
      setStartWithAutoplay(true);
      setSelectedItem(INITIAL_MEDIA[0]);
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
      {/* Global Background Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MagicParticles />
      </div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">WonderLens</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleStartSlideshow}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all border border-indigo-400 text-sm font-bold shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] active:scale-95 group"
          >
            <Play className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-white">Play</span>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1"></div>

          {/* Music Control Group */}
          <div className="relative" ref={playlistRef}>
            <div className="flex flex-col bg-slate-800 rounded-full border border-slate-700 overflow-hidden relative">
              <div className="flex items-center p-0.5 z-10 relative">
                <button 
                  onClick={toggleMusic}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors text-sm font-medium ${isMusicEnabled ? 'text-green-400' : 'text-slate-400'}`}
                  title={isMusicEnabled ? "Turn Off Music" : "Turn On Music"}
                >
                  {isMusicEnabled ? <Music className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                </button>
                
                <div className="h-4 w-px bg-slate-700 mx-1"></div>

                <div className="px-2 text-xs text-slate-300 max-w-[80px] sm:max-w-[100px] truncate select-none">
                  {MUSIC_TRACKS[currentTrackIndex].title}
                </div>

                <button 
                  onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                  className={`p-1.5 rounded-full transition-colors ${isPlaylistOpen ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  title="Select Music"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
              </div>
              
              {/* Progress Bar */}
              {isMusicEnabled && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-slate-700 w-full">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300 ease-linear"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Playlist Dropdown */}
            {isPlaylistOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="py-2">
                   <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Track</div>
                   {MUSIC_TRACKS.map((track, i) => (
                     <button
                       key={i}
                       onClick={() => selectTrack(i)}
                       className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                         i === currentTrackIndex 
                           ? 'bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-500' 
                           : 'text-slate-300 hover:bg-white/5 border-l-2 border-transparent'
                       }`}
                     >
                       <span>{track.title}</span>
                       {i === currentTrackIndex && <Music className="w-3 h-3 text-indigo-400" />}
                     </button>
                   ))}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={toggleAppFullscreen}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            title="Toggle Fullscreen"
          >
             {isAppFullscreen ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4 text-white" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full max-w-4xl mx-auto px-6 pt-10 pb-12 text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wider mb-6 animate-fade-up hover:bg-indigo-500/20 transition-colors cursor-default">
          <Calendar className="w-3 h-3 text-indigo-400" />
          <span>{APP_SUBTITLE}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Capturing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Magic</span> of Childhood
        </h1>

        <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.2s' }}>
          A collection of precious moments, frozen in time and brought to life with magical stories.
        </p>
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
          isMusicPlaying={isMusicEnabled} // Pass intent
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