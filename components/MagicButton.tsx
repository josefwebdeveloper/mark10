import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface MagicButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const MagicButton: React.FC<MagicButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden rounded-full px-8 py-3 
        text-sm font-semibold tracking-wide shadow-lg shadow-indigo-500/30
        transition-all duration-300 transform active:scale-95
        ${disabled 
          ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-indigo-500/50 hover:brightness-110'}
      `}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Summoning...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Reveal Story</span>
          </>
        )}
      </div>
    </button>
  );
};