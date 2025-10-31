import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Volume2, Send } from 'lucide-react';
import { analyticsService } from '../services/SupabaseService';

/**
 * ZC Voice Assistant for x444 Website
 * AI-powered voice assistant with knowledge of x4 tokens and x444 protocol
 * Uses Groq for AI responses and ElevenLabs for voice synthesis
 */

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Knowledge base for x4 Protocol and x444
const X4_KNOWLEDGE_BASE = {
  'what is x444': `x444 is a permissionless memocoin payment protocol. Creators earn 1% on every transaction with zero setup fees. Accept memecoins like DEGEN, PEPE, X4 and get paid instantly to your wallet.`,

  'creator dashboard': `Go to /dashboard to create payment links. Connect your wallet, pick a preset contract, set your tokens, and get widget code instantly. Zero friction, full control.`,

  'how to create a payment link': `1. Visit /dashboard and connect MetaMask. 2. Click "Create Payment Link". 3. Choose preset (Creator Basic, NFT Drop, or E-Commerce). 4. Name your link and select tokens. 5. Copy widget code and embed it on your site.`,

  'gasless payments': `Customers pay ZERO gas. They sign a message (costs $0), you submit it on-chain (~$0.20 on Base). You keep the 1% fee. This is the whole point—true gasless.`,

  'x444 vs x402': `x402 is Coinbase's HTTP 402 standard for stablecoins. x444 extends it for memecoins with dynamic pricing. Both enable payment-required flows, x444 just handles volatility.`,

  'payment presets': `Creator Basic (recommended, fast), NFT Drop (with access control), or E-Commerce (inventory tracking). All pre-deployed on Base. No gas to use them.`,

  'how much does it cost': `Zero platform fees. You only pay transaction gas (~$0.20 on Base). You earn 1% of every payment automatically. Super simple.`,

  'what tokens can i accept': `Any whitelisted memocoin. Default: DEGEN, PEPE, X4. More can be added through governance voting.`,

  'where do i get paid': `Straight to your wallet. 1% of every payment hits your address instantly. No waiting, no middleman, no approval needed.`,

  'permissionless': `No signup, no KYC, no approval process. Just connect wallet, create link, start earning. True decentralized payments.`,

  'x4 token features': `Hold X4 for fee discounts, staking yields, and governance votes. 1 token = 1 vote on protocol changes.`,

  'ai governance': `AI analyzes payment proposals and risks. Community votes on changes. No single point of control. AI agents coordinate decisions autonomously while humans decide outcomes.`,

  'ai agents': `8 specialized agents monitor payments, optimize fees, detect fraud, manage liquidity, analyze governance proposals, coordinate across chains, and execute approved decisions 24/7.`,

  'how do ai agents work': `Each agent specializes: Payment Monitor checks transactions, Risk Analyzer assesses proposals, Fee Optimizer finds best rates, Fraud Detector flags suspicious activity, Liquidity Manager balances pools, Governance Analyst provides voting data, Cross-Chain Coordinator bridges networks, Decision Executor runs approved changes.`,

  'ai reinforcement learning': `Agents learn from outcomes. If an AI recommendation gets approved and succeeds, its weight increases. Bad predictions lose weight. Continuous improvement without human micromanagement.`,

  'ai autonomous execution': `When the community votes yes on an AI proposal, the smart contract executes it automatically. No waiting, no bottlenecks, no admin intervention needed.`,

  'x4 governance voting': `1 x4 token = 1 vote. Vote on AI proposals, fee changes, token whitelisting, and protocol upgrades. AI provides analysis, you decide.`,

  'what can ai propose': `Fee structure changes, new token additions, parameter tweaks, emergency responses, and optimization improvements. Always subject to community vote.`,

  'factory contracts': `Deploy custom contracts with vanity x4 addresses. Or use presets for instant setup. Factory runs autonomously on-chain.`,

  'widget code': `React component or vanilla JavaScript. Copy the generated code, paste into your site, accept payments in minutes.`,

  'how does ai help': `Real-time monitoring, risk assessment, fraud detection, fee optimization, governance analysis, autonomous execution, 24/7 operation. Community stays in control.`,

  'is ai in control': `No. AI proposes, analyzes, and executes. Humans vote on everything that matters. AI is a tool for scale, not control.`,

  'default': `I'm ZC, your x444 guide. Ask me about creating payment links, gasless payments, AI agents, governance, or how x444 works. What's your question?`
};

// Create optimized lookup map for O(1) keyword matching instead of O(n)
const createKeywordMap = () => {
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(X4_KNOWLEDGE_BASE)) {
    if (key !== 'default') {
      map.set(key, value);
      // Add first word as shortcut for faster matching
      map.set(key.split(' ')[0], value);
    }
  }
  return map;
};

const keywordMap = createKeywordMap();

export default function ZCVoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Yo! I\'m ZC. Want to start earning on memocoin payments? Ask me about the creator dashboard, gasless payments, or how x444 works.',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      // Auto-send when speech is final
      if (finalTranscript) {
        setInputValue(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Toggle voice recording
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      console.error('Speech Recognition not supported');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
    }
  };

  // Get response from knowledge base using optimized lookup
  const getKnowledgeResponse = (query: string): { response: string; topic: string } => {
    const lowerQuery = query.toLowerCase().trim();

    // Try exact match first
    if (keywordMap.has(lowerQuery)) {
      return { response: keywordMap.get(lowerQuery) || X4_KNOWLEDGE_BASE.default, topic: lowerQuery };
    }

    // Try first word match
    const firstWord = lowerQuery.split(' ')[0];
    if (keywordMap.has(firstWord)) {
      return { response: keywordMap.get(firstWord) || X4_KNOWLEDGE_BASE.default, topic: firstWord };
    }

    // Try substring matching as fallback
    for (const [key, value] of keywordMap) {
      if (lowerQuery.includes(key) || key.includes(firstWord)) {
        return { response: value, topic: key };
      }
    }

    return { response: X4_KNOWLEDGE_BASE.default, topic: 'default' };
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const queryText = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Get response from knowledge base
      const { response, topic } = getKnowledgeResponse(queryText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Track voice query in analytics
      await analyticsService.trackVoiceQuery(queryText, topic, response);

      // Synthesize voice
      await synthesizeVoice(response);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Synthesize voice using ElevenLabs
  const synthesizeVoice = async (text: string) => {
    try {
      setIsPlaying(true);

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
        method: 'POST',
        headers: {
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.85,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Voice synthesis error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 group">
        {/* Label */}
        <div className="bg-slate-900 border border-orange-500/50 rounded-lg px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <p className="text-orange-400 font-semibold">CZ AI Agent</p>
          <p className="text-x4-silver-400 text-xs">Ask about x444, gasless payments, or governance</p>
        </div>
        {/* Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
          title="Open CZ AI Agent - Ask about x444, gasless payments, AI agents, or governance"
        >
          <Mic className="w-7 h-7 text-white group-hover:animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border border-x4-gold-500/40 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header - Premium X4 Branded */}
      <div className="bg-gradient-to-r from-x4-gold-500 via-yellow-500 to-orange-500 px-6 py-5 flex items-center justify-between relative overflow-hidden">
        {/* Gradient overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>

        <div className="flex items-center gap-3 relative z-10">
          {/* Animated avatar */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-x4-gold-400 to-orange-400 animate-spin" style={{animationDuration: '20s'}} opacity={0.3}></div>
            <Mic className="w-6 h-6 text-x4-gold-500 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-white text-lg">CZ AI Agent</h3>
              <span className="text-xs font-bold bg-black/40 text-x4-gold-300 px-2 py-1 rounded">LIVE</span>
            </div>
            <p className="text-xs text-white/90 font-semibold">Autonomous Protocol Intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-black/30 rounded-lg transition-all duration-200 relative z-10 hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-900/20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-xl backdrop-blur-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-x4-gold-500 to-orange-500 text-white shadow-lg shadow-x4-gold-500/20 font-semibold'
                  : 'bg-gradient-to-br from-slate-800/80 to-slate-700/80 text-x4-silver-300 border border-x4-gold-500/20'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className="text-xs mt-2 opacity-60 font-medium">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-x4-gold-500/20 px-4 py-3 rounded-xl backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-x4-gold-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-x4-gold-400 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-x4-gold-400 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-x4-gold-500/20 p-4 space-y-3 bg-gradient-to-t from-slate-900/50 to-transparent">
        {isPlaying && (
          <div className="flex items-center gap-2 px-3 py-2 bg-x4-gold-500/20 border border-x4-gold-500/40 rounded-lg">
            <Volume2 className="w-4 h-4 text-x4-gold-400 animate-pulse" />
            <span className="text-xs text-x4-gold-300 font-semibold">Playing voice response...</span>
          </div>
        )}
        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/40 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-300 font-semibold">Recording...</span>
            {transcript && <span className="text-xs text-red-200 flex-1">{transcript}</span>}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about payments, AI agents, governance..."
            className="flex-1 bg-slate-800/60 border border-x4-gold-500/20 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-x4-gold-500/50 focus:ring-1 focus:ring-x4-gold-500/20 transition-all"
            disabled={isLoading || isRecording}
          />
          <button
            onClick={toggleVoiceInput}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-white font-bold transition-all ${
              isRecording
                ? 'bg-red-500/80 hover:bg-red-600 shadow-lg shadow-red-500/20'
                : 'bg-slate-700/60 hover:bg-slate-600 border border-x4-gold-500/20'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-x4-gold-500 to-orange-500 hover:from-x4-gold-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg flex items-center gap-2 text-white font-bold transition-all shadow-lg shadow-x4-gold-500/20 hover:shadow-x4-gold-500/40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 text-center font-medium">
          Powered by Groq AI & ElevenLabs Voice
        </p>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}
