import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Mic, Volume2, VolumeX, Loader, Minimize2, Maximize2, MessageCircle } from 'lucide-react';
import { useCZChat } from '../hooks/useCZChat';

export const ChatWindow: React.FC = () => {
  const {
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
    setOpen,
    setViewMode,
    clearChat,
  } = useCZChat();

  const [inputValue, setInputValue] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isConfigured) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleSpeakMessage = async (text: string, messageId: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      await speakMessage(text, messageId);
    }
  };

  // Bubble view - Minimized
  if (!isOpen) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 p-4 rounded-full bg-gradient-to-r from-x4-gold-500 to-x4-gold-600 text-x4-black-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 border border-x4-gold-400"
        title="Chat with CZ"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  // Render based on view mode
  return (
    <>
      {/* Modal overlay */}
      {viewMode === 'modal' && (
        <div
          className="fixed inset-0 bg-x4-black-900/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Chat window container */}
      <div
        className={`fixed z-50 flex flex-col bg-x4-black-800 border border-x4-gold-500/40 rounded-lg shadow-2xl transition-all duration-300 ${
          viewMode === 'bubble'
            ? 'bottom-4 right-4 w-96 h-[500px]'
            : viewMode === 'panel'
            ? 'right-0 top-0 w-96 h-screen rounded-none'
            : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-[600px]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-x4-gold-500/20 bg-gradient-to-r from-x4-black-900 to-x4-black-800">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-x4-gold-500 animate-pulse" />
            <h2 className="text-lg font-bold text-x4-gold-500">Ask CZ</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <button
              onClick={() => {
                const modes: Array<'bubble' | 'panel' | 'modal'> = ['bubble', 'panel', 'modal'];
                const currentIndex = modes.indexOf(viewMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                setViewMode(modes[nextIndex]);
              }}
              className="p-1.5 hover:bg-x4-black-700 rounded transition-colors"
              title={`Switch view (current: ${viewMode})`}
            >
              {viewMode === 'bubble' ? (
                <Maximize2 size={18} className="text-x4-gold-500" />
              ) : (
                <Minimize2 size={18} className="text-x4-gold-500" />
              )}
            </button>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-x4-black-700 rounded transition-colors"
            >
              <X size={18} className="text-x4-silver-500" />
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-x4-black-900/80">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle size={32} className="text-x4-gold-500/50 mb-2" />
              <p className="text-x4-silver-400 text-sm">
                Welcome! Ask me anything about x4 protocol, crypto, or trading.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  message.role === 'user'
                    ? 'bg-x4-gold-500 text-x4-black-900'
                    : 'bg-x4-silver-500 text-x4-black-900'
                }`}
              >
                {message.role === 'user' ? 'You' : 'CZ'}
              </div>

              {/* Message content */}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-x4-gold-500/20 text-x4-gold-100 border border-x4-gold-500/40'
                    : 'bg-x4-black-700 text-x4-silver-200 border border-x4-silver-500/30'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>

                {/* Voice controls for assistant messages */}
                {message.role === 'assistant' && voiceEnabled && (
                  <button
                    onClick={() => handleSpeakMessage(message.content, message.id)}
                    className="mt-2 text-xs flex items-center gap-1 opacity-75 hover:opacity-100 transition-opacity"
                  >
                    {message.isPlaying || isSpeaking ? (
                      <>
                        <VolumeX size={12} />
                        Stop
                      </>
                    ) : (
                      <>
                        <Volume2 size={12} />
                        Hear it
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-x4-gold-500 flex items-center justify-center flex-shrink-0">
                <Loader size={16} className="animate-spin text-x4-black-900" />
              </div>
              <div className="bg-x4-black-700 px-4 py-2 rounded-lg border border-x4-gold-500/30">
                <p className="text-sm text-x4-gold-300">CZ is thinking...</p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-x4-gold-500/20 p-4 bg-x4-black-900">
          <form onSubmit={handleSendMessage} className="space-y-3">
            {/* Voice toggle */}
            <button
              type="button"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-full py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-2 ${
                voiceEnabled
                  ? 'bg-x4-gold-500/10 text-x4-gold-400 hover:bg-x4-gold-500/20 border border-x4-gold-500/30'
                  : 'bg-x4-black-700 text-x4-silver-400 hover:bg-x4-black-600 border border-x4-silver-500/20'
              }`}
            >
              <Volume2 size={14} />
              Voice {voiceEnabled ? 'On' : 'Off'}
            </button>

            {/* Message input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask CZ..."
                className="flex-1 bg-x4-black-800 border border-x4-silver-500/30 rounded px-3 py-2 text-sm text-x4-silver-100 placeholder-x4-silver-500 focus:border-x4-gold-500 focus:outline-none transition-colors"
                disabled={isLoading}
              />

              {/* Voice input button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`px-3 py-2 rounded transition-colors ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : 'bg-x4-black-800 text-x4-silver-400 hover:bg-x4-black-700 border border-x4-silver-500/30'
                }`}
                title={isListening ? 'Stop listening' : 'Start listening'}
              >
                <Mic size={16} />
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="px-3 py-2 rounded bg-x4-gold-500/20 text-x4-gold-400 hover:bg-x4-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-x4-gold-500/40 transition-colors"
              >
                {isLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>

            {/* Clear button */}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="w-full py-1.5 px-3 rounded text-xs bg-x4-black-800 text-x4-silver-400 hover:bg-x4-black-700 transition-colors border border-x4-silver-500/20"
              >
                Clear Chat
              </button>
            )}
          </form>

          {/* Listening indicator */}
          {isListening && (
            <div className="mt-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Listening...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
