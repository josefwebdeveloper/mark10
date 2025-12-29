import React from 'react';
import { MediaItem } from '../types';
import { MediaCard } from './MediaCard';

interface GalleryProps {
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ items, onItemClick }) => {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
      {items.map((item, index) => (
        <MediaCard 
          key={item.id} 
          item={item} 
          index={index}
          onClick={onItemClick} 
        />
      ))}
      
      {items.length === 0 && (
        <div className="text-center py-32 col-span-full">
          <p className="text-indigo-200 text-2xl font-['Fredoka'] animate-pulse">Waiting for memories to appear...</p>
        </div>
      )}
    </div>
  );
};