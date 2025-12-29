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
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-800 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-2"
        onClick={() => onClick(item)}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden">
           
           {/* Loading Skeleton */}
           {!isLoaded && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
               <div className="w-8 h-8 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
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