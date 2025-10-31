import React from 'react';
import { Volume2, VolumeX, Play, Pause, Loader } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';

interface VoiceButtonProps {
  text: string;
  className?: string;
  variant?: 'icon' | 'button';
  tooltipText?: string;
}

/**
 * Button component to trigger voice narration
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({
  text,
  className = '',
  variant = 'icon',
  tooltipText = 'Listen',
}) => {
  const { speak, stop, isPlaying, isLoading, isMuted, isConfigured, error } = useVoice();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      stop();
    } else {
      try {
        await speak(text);
      } catch (err) {
        console.error('Voice error:', err);
      }
    }
  };

  if (!isConfigured) {
    return null; // Don't render if voice not configured
  }

  if (error) {
    console.error('Voice button error:', error);
  }

  const baseClasses = 'inline-flex items-center justify-center transition-all duration-200';
  const disabledClasses = isMuted ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80';

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isMuted || isLoading}
        className={`${baseClasses} ${disabledClasses} text-x4-gold-500 ${className}`}
        title={tooltipText}
        aria-label={`${isPlaying ? 'Stop' : 'Play'} ${tooltipText}`}
      >
        {isLoading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  // Button variant
  return (
    <button
      onClick={handleClick}
      disabled={isMuted || isLoading}
      className={`${baseClasses} gap-2 px-4 py-2 rounded-lg bg-x4-gold-500/10 hover:bg-x4-gold-500/20 text-x4-gold-500 border border-x4-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span>Listening...</span>
        </>
      ) : isPlaying ? (
        <>
          <Pause className="w-4 h-4" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          <span>{tooltipText}</span>
        </>
      )}
    </button>
  );
};

export default VoiceButton;
