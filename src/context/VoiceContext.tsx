import React, { createContext, useCallback, useState, useEffect } from 'react';
import ElevenLabsTTSCache from '../services/ElevenLabsTTSCache';

interface VoiceContextType {
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  volume: number;
  isConfigured: boolean;
  error: string | null;
  speak: (text: string) => Promise<void>;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
}

export const VoiceContext = createContext<VoiceContextType | null>(null);

interface VoiceProviderProps {
  children: React.ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [ttsService] = useState(() => new ElevenLabsTTSCache());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check if voice is configured on mount
  useEffect(() => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceId = import.meta.env.VITE_ELEVENLABS_CZ_VOICE_ID;
    setIsConfigured(!!(apiKey && voiceId));
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!isConfigured) {
        setError('Voice service not configured. Please set VITE_ELEVENLABS_API_KEY and VITE_ELEVENLABS_CZ_VOICE_ID');
        return;
      }

      if (isMuted) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { audioBlob } = await ttsService.getAudio(text);

        // Create audio element with volume control
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.volume = volume;

        setIsPlaying(true);

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsPlaying(false);
        };

        audio.onerror = (err) => {
          console.error('Audio playback error:', err);
          URL.revokeObjectURL(audioUrl);
          setIsPlaying(false);
          setError('Failed to play audio');
        };

        await audio.play();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate voice';
        console.error('Voice synthesis error:', errorMessage);
        setError(errorMessage);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    },
    [ttsService, isConfigured, isMuted, volume]
  );

  const stop = useCallback(() => {
    ttsService.stopAudio();
    setIsPlaying(false);
  }, [ttsService]);

  const handleSetMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    if (muted && isPlaying) {
      stop();
    }
  }, [isPlaying, stop]);

  const handleSetVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const value: VoiceContextType = {
    isPlaying,
    isLoading,
    isMuted,
    volume,
    isConfigured,
    error,
    speak,
    stop,
    setMuted: handleSetMuted,
    setVolume: handleSetVolume,
  };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

export default VoiceProvider;
