import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Terminal, Code2, Shield, Cpu } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'system' | 'info';
  content: string;
  timestamp: Date;
}

export default function CzdosPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'CZDOS v1.0 - Advanced Crypto Intelligence Terminal',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'system',
      content: 'Powered by x444 Protocol & Zero-Knowledge Privacy',
      timestamp: new Date(),
    },
    {
      id: '3',
      type: 'info',
      content: 'Welcome to the DOS 286 inspired crypto experience. Type your command or ask about x444, privacy wallets, or blockchain tech.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'what is x444': 'x444 is an HTTP 402 memecoin payment protocol. It enables instant, gasless payments for content creators using memecoins like DEGEN and PEPE.',
        'privacy': 'Our Zero-Knowledge circuits enable private payment verification without revealing sensitive information on-chain. Powered by Noir & Barretenberg.',
        'zk': 'Zero-Knowledge proofs allow you to prove knowledge of private values without revealing them. Perfect for privacy-preserving payments.',
        'help': 'Available commands: "what is x444", "privacy", "zk", "circuit", "creator", "technical"',
        'circuit': 'Noir circuit compiled successfully. Generates commitment & nullifier for private payments using Pedersen hashing on BN254 curve.',
        'creator': 'Creators can accept payments in memecoins with zero gas fees using x444 widgets. No infrastructure complexity.',
        'technical': 'Stack: Express.js API, Noir circuits, Supabase DB, Render hosting. Full type-safe TypeScript implementation.',
        default: 'Command not recognized. Type "help" for available commands.',
      };

      let response = responses.default;
      const lowerInput = input.toLowerCase();

      Object.keys(responses).forEach((key) => {
        if (lowerInput.includes(key)) {
          response = responses[key];
        }
      });

      const systemMessage: Message = {
        id: Date.now().toString() + 'response',
        type: 'info',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, systemMessage]);
      setIsLoading(false);
    }, 500);
  };

  const features = [
    { icon: Shield, label: 'Zero-Knowledge Privacy', desc: 'Private payment verification' },
    { icon: Zap, label: 'Gasless Payments', desc: 'No blockchain fees' },
    { icon: Code2, label: 'Developer Friendly', desc: 'Simple API integration' },
    { icon: Cpu, label: 'Advanced Circuits', desc: 'Noir-powered cryptography' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-950/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              CZDOS Terminal
            </h1>
          </div>
          <p className="text-slate-400 ml-11">Advanced Crypto Intelligence & Privacy Wallet Experience</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col h-[600px]">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.type !== 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                          <Terminal className="w-4 h-4 text-slate-950" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : msg.type === 'system'
                          ? 'bg-slate-700 text-amber-400 font-mono text-sm'
                          : 'bg-slate-700 text-slate-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-slate-950 animate-spin" />
                      </div>
                    </div>
                    <div className="bg-slate-700 px-4 py-2 rounded-lg">
                      <span className="text-slate-400">Processing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-700 p-4 bg-slate-800/50"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about x444, privacy, or ZK circuits..."
                    className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 rounded-lg px-4 py-2 font-semibold hover:shadow-lg hover:shadow-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Features Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-amber-400">Features</h3>
              <div className="space-y-4">
                {features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div key={idx} className="flex gap-3">
                      <Icon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-sm">{feature.label}</p>
                        <p className="text-slate-400 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-amber-400">Circuit Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Compiler</span>
                  <span className="text-green-400">Noir 0.36.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-green-400">✓ Compiled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Proof System</span>
                  <span className="text-green-400">PLONK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Curve</span>
                  <span className="text-green-400">BN254</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="font-semibold text-amber-400 mb-3">About x444</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              x444 is an HTTP 402 memecoin payment protocol that enables instant, gasless payments for content creators. Accept DEGEN, PEPE, X4, and more with zero infrastructure complexity.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="font-semibold text-amber-400 mb-3">Privacy Circuits</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our Noir-powered ZK circuits generate commitments and nullifiers for private payment verification. Prove knowledge of payment details without revealing them on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
