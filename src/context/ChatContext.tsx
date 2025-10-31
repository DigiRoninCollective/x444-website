import React, { createContext, useCallback, useState, useEffect, useRef } from 'react';
import CZChatService from '../services/CZChatService';
import ElevenLabsTTSCache from '../services/ElevenLabsTTSCache';
import { analyticsService } from '../services/SupabaseService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isPlaying?: boolean;
}

export interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  error: string | null;
  isConfigured: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  viewMode: 'bubble' | 'panel' | 'modal';

  sendMessage: (text: string) => Promise<void>;
  speakMessage: (text: string, messageId: string) => Promise<void>;
  stopSpeaking: () => void;
  startListening: () => void;
  stopListening: () => void;

  setOpen: (open: boolean) => void;
  setViewMode: (mode: 'bubble' | 'panel' | 'modal') => void;
  clearChat: () => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chatService] = useState(() => new CZChatService());
  const [ttsService] = useState(() => new ElevenLabsTTSCache());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState<'bubble' | 'panel' | 'modal'>('bubble');
  const [isConfigured, setIsConfigured] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Check configuration on mount
  useEffect(() => {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const elevenLabsKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const elevenLabsVoiceId = import.meta.env.VITE_ELEVENLABS_CZ_VOICE_ID;

    setIsConfigured(!!(groqKey && elevenLabsKey && elevenLabsVoiceId));
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isConfigured) return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not available');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          // Auto-send final transcription
          if (transcript.trim()) {
            sendMessage(transcript.trim());
          }
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [isConfigured]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || !isConfigured) return;

      setError(null);
      setIsLoading(true);

      try {
        // Create conversation if needed
        let currentConversationId = conversationId;
        if (!currentConversationId) {
          currentConversationId = await analyticsService.createChatConversation('bubble');
          setConversationId(currentConversationId);
        }

        // Add user message
        const userMessageId = `msg_${Date.now()}_user`;
        const userMessage: ChatMessage = {
          id: userMessageId,
          role: 'user',
          content: text,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMessage]);

        // Track user message in analytics
        if (currentConversationId) {
          await analyticsService.trackChatMessage(currentConversationId, 'user', text);
        }

        // Get response from CZ
        const response = await chatService.chat(text);

        // Add assistant message
        const assistantMessageId = `msg_${Date.now()}_assistant`;
        const assistantMessage: ChatMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: response.message,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Track assistant message in analytics
        if (currentConversationId) {
          await analyticsService.trackChatMessage(currentConversationId, 'assistant', response.message);
        }

        // Auto-speak the response
        try {
          await speakMessage(response.message, assistantMessageId);
        } catch (err) {
          console.warn('Could not auto-speak response:', err);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
        console.error('Chat error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [chatService, isConfigured, conversationId]
  );

  const speakMessage = useCallback(
    async (text: string, messageId: string) => {
      try {
        setIsSpeaking(true);

        // Get audio from TTS service
        const { audioBlob } = await ttsService.getAudio(text);

        // Create and play audio
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.volume = 0.8;

        playingAudioRef.current = audio;

        // Update UI to show playing state
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isPlaying: true } : msg
          )
        );

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, isPlaying: false } : msg
            )
          );
          setIsSpeaking(false);
          playingAudioRef.current = null;
        };

        audio.onerror = (err) => {
          console.error('Audio playback error:', err);
          URL.revokeObjectURL(audioUrl);
          setIsSpeaking(false);
          playingAudioRef.current = null;
        };

        await audio.play();
      } catch (err) {
        console.error('TTS error:', err);
        setError(err instanceof Error ? err.message : 'Text-to-speech failed');
        setIsSpeaking(false);
      }
    },
    [ttsService]
  );

  const stopSpeaking = useCallback(() => {
    if (playingAudioRef.current) {
      playingAudioRef.current.pause();
      playingAudioRef.current.currentTime = 0;
      playingAudioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const handleSetOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handleSetViewMode = useCallback((mode: 'bubble' | 'panel' | 'modal') => {
    setViewMode(mode);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setConversationId(null);
    chatService.clearHistory();
  }, [chatService]);

  const value: ChatContextType = {
    messages,
    isLoading,
    isOpen,
    error,
    isConfigured,
    isSpeaking,
    isListening,
    viewMode,
    sendMessage,
    speakMessage,
    stopSpeaking,
    startListening,
    stopListening,
    setOpen: handleSetOpen,
    setViewMode: handleSetViewMode,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
