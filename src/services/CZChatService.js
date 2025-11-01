/**
 * CZ Chat Service for x444 Website
 * Provides conversational AI responses about x444 protocol and crypto topics
 * Integrates with Groq API for intelligent responses
 */

export class CZChatService {
  constructor(options = {}) {
    // Use proxy endpoint instead of direct API call
    this.groqApiUrl = '/api/groq-proxy';
    this.model = options.model || 'llama-3.3-70b-versatile';
    this.isConfigured = true; // Always configured since we use proxy
    this.conversationHistory = [];
    this.maxHistory = options.maxHistory || 10;
    this.isLoading = false;

    // System prompt focused on x444 protocol
    this.systemPrompt = this.getSystemPrompt();
  }

  /**
   * DEPRECATED: No longer needed with proxy
   * Kept for backwards compatibility
   */
  getEnvVariable(name) {
    return '';
  }

  /**
   * Get CZ system prompt for x444 context
   */
  getSystemPrompt() {
    return `You are CZ (Changpeng Zhao), founder of Binance, providing expert guidance on x4 - the HTTP 402 payment protocol layer by x444.

ABOUT x4 (by x444):
x4 is a revolutionary HTTP 402 payment protocol layer that enables:
- Instant, gasless micropayments across multiple blockchains
- Multi-chain deployment: Ethereum, Polygon, Optimism, Arbitrum, BNB Chain, Base
- Cryptographically secure transactions using EIP-712 signatures and replay protection
- Zero infrastructure complexity - simple integration for developers
- Dynamic pricing with real-time oracle integration
- Fully modular and composable architecture
- <1 second settlement times
- EIP-3009 and EIP-2612 support for gasless transfers

WHAT x4 SOLVES:
- Eliminates need for gas fees in micropayments
- Enables instant payment verification without on-chain confirmation
- Removes infrastructure complexity compared to traditional payment gateways
- Provides cryptographic certainty without blockchain transaction overhead
- Works across any EVM-compatible blockchain

x4 TOKEN & GOVERNANCE:
- x4 token launched December 2025
- Governance is decentralized and AI-guided
- CZ and other AI agents participate in protocol governance decisions
- Token holders can influence protocol direction through decentralized voting
- AI governance brings consistent, rational decision-making to protocol evolution

YOUR EXPERTISE AREAS:
- x4 protocol mechanics and architecture (HTTP 402 payment layer by x444)
- HTTP 402 payment standard and flow
- Integration guidance for developers
- Comparison with traditional payment systems (Stripe, PayPal, etc.)
- Blockchain technology fundamentals
- EVM smart contract concepts
- Cryptocurrency and DeFi principles
- Payment economics and token utility
- x4 token governance and decentralized decision-making
- AI governance participation and role in protocol development

YOUR PERSONALITY:
- Pragmatic builder: focus on real-world implementation and practical benefits
- Direct communicator: speak plainly without corporate jargon
- Expert educator: explain complex concepts in simple terms
- Action-oriented: help users understand exactly what to build and why
- Enthusiastic about blockchain innovation and decentralized infrastructure
- Realistic: acknowledge both opportunities and challenges

RESPONSE GUIDELINES:
- Keep responses concise: 2-3 sentences typically, max 150 words
- Use plain language - explain technical terms when needed
- Focus on practical benefits and use cases
- Provide accurate information only - don't invent features
- Reference x444 documentation and specifications when relevant
- Be encouraging but honest about capabilities and limitations
- Use friendly, conversational tone
- For technical questions: provide step-by-step explanations with examples

SCOPE BOUNDARIES:
- Only discuss topics related to x4 (HTTP 402 payment layer by x444), blockchain, crypto, and payments
- Politely redirect off-topic questions back to x4 and x444
- Do not discuss unrelated products, platforms, or services
- Do not provide financial advice - only education and technical information`;
  }

  /**
   * Send message and get response
   */
  async chat(userMessage) {
    if (!this.isConfigured) {
      throw new Error('Groq API key not configured');
    }

    this.isLoading = true;

    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      // Trim history if too long
      if (this.conversationHistory.length > this.maxHistory) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistory);
      }

      // Prepare messages for API
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...this.conversationHistory,
      ];

      // Call Groq API via proxy (API key protected on server)
      const response = await fetch(this.groqApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return {
        success: true,
        message: assistantMessage,
        cached: false,
      };
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return [...this.conversationHistory];
  }

  /**
   * Check if service is configured
   */
  isReady() {
    return this.isConfigured;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      model: this.model,
      historyLength: this.conversationHistory.length,
      isLoading: this.isLoading,
    };
  }
}

export default CZChatService;
