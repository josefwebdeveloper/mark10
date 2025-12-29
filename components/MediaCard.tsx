import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { MediaItem, MediaType } from '../types';

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onClick: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, index, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="break-inside-avoid mb-8 animate-fade-up"
      style={{ animationDelay: `${0.1 + (index * 0.05)}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <div 
        className="group relative cursor-pointer p-4 rounded-[2rem] bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] hover:border-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
        onClick={() => onClick(item)}
      >
        {/* Ambient Glows (Matches Hero Section) */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] group-hover:bg-amber-500/15 transition-all duration-700 pointer-events-none"></div>

        {/* Inner Content Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] z-10 bg-slate-900/50">
           
           {/* Loading Skeleton */}
           {!isLoaded && (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-8 h-8 border-2 border-white/10 border-t-indigo-400 rounded-full animate-spin"></div>
             </div>
           )}

           {/* Image/Video */}
           {item.type === MediaType.VIDEO ? (
            <>
               <img 
                src={item.thumbnail || item.url.replace(/\.[^/.]+$/, ".jpg")} // Fallback to replacing extension if no thumb
                alt={item.title}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
              />
              {/* Play Button Overlay with Effects */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                 <div className="relative">
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '1.5s' }}></div>
                    
                    {/* Main Button */}
                    <div className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <img 
              src={item.url} 
              alt={item.title}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
};