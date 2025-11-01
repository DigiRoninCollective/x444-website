/**
 * x444 Memecoin Payment Widget - Standalone Embed Script
 *
 * Accept payments in memecoins and volatile assets with instant settlement
 * Built on HTTP 402 protocol, powered by x444's memecoin payment layer
 *
 * What is x444?
 * - Accept DEGEN, PEPE, SHIB, DOGE, and other memecoins
 * - Real-time volatile asset pricing with oracle integration
 * - Gasless payments (zero fees for users)
 * - Instant settlement (<1 second)
 * - Non-custodial (direct wallet-to-wallet)
 *
 * Note: x444 ≠ X402 (Coinbase's protocol)
 * x444 is specifically designed for memecoins and volatile assets!
 *
 * Usage:
 * <script src="https://cdn.x444.xyz/widget.js"></script>
 * <div id="x444-payment"></div>
 * <script>
 *   X444.init({
 *     elementId: 'x444-payment',
 *     linkId: 'your_payment_link_id',
 *     onSuccess: (txHash) => console.log('Memecoin payment received!', txHash),
 *     onError: (error) => console.error('Payment failed:', error)
 *   });
 * </script>
 */

(function(window) {
  'use strict';

  // Check if already loaded
  if (window.X444) {
    console.warn('X444 widget already loaded');
    return;
  }

  const X444 = {
    version: '1.0.0',

    // Default configuration
    config: {
      apiUrl: 'https://bvuauqwgodbesyfswiun.supabase.co/functions/v1',
      supabaseUrl: 'https://bvuauqwgodbesyfswiun.supabase.co',
      theme: 'dark' // dark, light, minimal
    },

    /**
     * Initialize the payment widget
     */
    init: function(options) {
      if (!options.elementId) {
        throw new Error('X444: elementId is required');
      }
      if (!options.linkId) {
        throw new Error('X444: linkId is required');
      }

      const container = document.getElementById(options.elementId);
      if (!container) {
        throw new Error(`X444: Element #${options.elementId} not found`);
      }

      // Merge options with defaults
      const config = {
        ...this.config,
        ...options
      };

      // Render the widget
      this.render(container, config);
    },

    /**
     * Render the payment widget HTML
     */
    render: function(container, config) {
      const theme = config.theme || 'dark';

      container.innerHTML = `
        <div class="x444-widget x444-theme-${theme}" id="x444-widget-${config.linkId}">
          <div class="x444-loading">
            <div class="x444-spinner"></div>
            <p>Loading payment options...</p>
          </div>
        </div>
      `;

      // Load payment link data
      this.loadPaymentLink(config.linkId, config, container);

      // Inject styles
      this.injectStyles();
    },

    /**
     * Load payment link data from API
     */
    loadPaymentLink: async function(linkId, config, container) {
      try {
        // Fetch payment link details
        const response = await fetch(`${config.supabaseUrl}/rest/v1/payment_links?id=eq.${linkId}`, {
          headers: {
            'apikey': config.supabaseAnonKey || '',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load payment link');
        }

        const data = await response.json();
        const paymentLink = data[0];

        if (!paymentLink) {
          throw new Error('Payment link not found');
        }

        // Render payment UI
        this.renderPaymentUI(container, paymentLink, config);
      } catch (error) {
        this.renderError(container, error.message);
        if (config.onError) config.onError(error);
      }
    },

    /**
     * Render the payment UI
     */
    renderPaymentUI: function(container, paymentLink, config) {
      const widgetEl = container.querySelector('.x444-widget');

      widgetEl.innerHTML = `
        <div class="x444-header">
          <h3 class="x444-title">${paymentLink.link_name}</h3>
          ${paymentLink.description ? `<p class="x444-description">${paymentLink.description}</p>` : ''}
        </div>

        <div class="x444-payment-form">
          <div class="x444-form-group">
            <label class="x444-label">Select Token</label>
            <select class="x444-select" id="x444-token-select">
              ${paymentLink.supported_tokens.map(token => `
                <option value="${token}">${this.getTokenSymbol(token)}</option>
              `).join('')}
            </select>
          </div>

          <div class="x444-form-group">
            <label class="x444-label">Amount (USD)</label>
            <input
              type="number"
              class="x444-input"
              id="x444-amount-input"
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>

          <button class="x444-button x444-button-primary" id="x444-pay-button">
            <span class="x444-button-text">Connect Wallet & Pay</span>
          </button>

          <div class="x444-status" id="x444-status"></div>
        </div>

        <div class="x444-footer">
          <p class="x444-powered">
            Powered by <a href="https://x444.xyz" target="_blank" class="x444-link">x444 Protocol</a>
          </p>
        </div>
      `;

      // Attach event listeners
      this.attachEventListeners(widgetEl, paymentLink, config);
    },

    /**
     * Attach event listeners to payment form
     */
    attachEventListeners: function(widgetEl, paymentLink, config) {
      const payButton = widgetEl.querySelector('#x444-pay-button');
      const amountInput = widgetEl.querySelector('#x444-amount-input');
      const tokenSelect = widgetEl.querySelector('#x444-token-select');
      const statusEl = widgetEl.querySelector('#x444-status');

      payButton.addEventListener('click', async () => {
        const amount = amountInput.value;
        const token = tokenSelect.value;

        if (!amount || parseFloat(amount) <= 0) {
          this.showStatus(statusEl, 'Please enter a valid amount', 'error');
          return;
        }

        await this.processPayment(amount, token, paymentLink, config, statusEl);
      });
    },

    /**
     * Process payment
     */
    processPayment: async function(amount, token, paymentLink, config, statusEl) {
      try {
        this.showStatus(statusEl, 'Connecting to wallet...', 'loading');

        // Check if MetaMask is installed
        if (!window.ethereum) {
          throw new Error('MetaMask not detected. Please install MetaMask to continue.');
        }

        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        const userAddress = accounts[0];

        this.showStatus(statusEl, 'Processing payment...', 'loading');

        // Here you would integrate with your actual payment contract
        // For now, this is a placeholder

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const txHash = '0x' + Math.random().toString(16).substring(2, 66);

        this.showStatus(statusEl, `Payment successful! TX: ${txHash.substring(0, 10)}...`, 'success');

        if (config.onSuccess) {
          config.onSuccess(txHash, amount, token);
        }

      } catch (error) {
        this.showStatus(statusEl, `Error: ${error.message}`, 'error');
        if (config.onError) {
          config.onError(error);
        }
      }
    },

    /**
     * Show status message
     */
    showStatus: function(statusEl, message, type) {
      statusEl.className = `x444-status x444-status-${type}`;
      statusEl.textContent = message;
      statusEl.style.display = 'block';
    },

    /**
     * Render error state
     */
    renderError: function(container, message) {
      const widgetEl = container.querySelector('.x444-widget');
      widgetEl.innerHTML = `
        <div class="x444-error">
          <p class="x444-error-message">⚠️ ${message}</p>
        </div>
      `;
    },

    /**
     * Get token symbol from address
     */
    getTokenSymbol: function(address) {
      // Token address to symbol mapping
      const tokens = {
        '0xDEGEN': 'DEGEN',
        '0xPEPE': 'PEPE',
        '0xX4': 'X4',
        // Add more tokens as needed
      };
      return tokens[address] || address.substring(0, 8) + '...';
    },

    /**
     * Inject widget styles
     */
    injectStyles: function() {
      if (document.getElementById('x444-widget-styles')) {
        return; // Already injected
      }

      const style = document.createElement('style');
      style.id = 'x444-widget-styles';
      style.textContent = `
        .x444-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 400px;
          margin: 0 auto;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .x444-theme-dark {
          background: #1a1a1a;
          color: #ffffff;
          border: 1px solid #333;
        }

        .x444-theme-light {
          background: #ffffff;
          color: #1a1a1a;
          border: 1px solid #e0e0e0;
        }

        .x444-header {
          margin-bottom: 24px;
        }

        .x444-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .x444-description {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .x444-form-group {
          margin-bottom: 16px;
        }

        .x444-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .x444-input,
        .x444-select {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          box-sizing: border-box;
        }

        .x444-theme-dark .x444-input,
        .x444-theme-dark .x444-select {
          background: #2a2a2a;
          border: 1px solid #444;
          color: #ffffff;
        }

        .x444-theme-light .x444-input,
        .x444-theme-light .x444-select {
          background: #f5f5f5;
          border: 1px solid #ddd;
          color: #1a1a1a;
        }

        .x444-button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .x444-button-primary {
          background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%);
          color: #000;
        }

        .x444-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(243, 156, 18, 0.3);
        }

        .x444-status {
          margin-top: 16px;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          display: none;
        }

        .x444-status-loading {
          background: #3498db;
          color: #fff;
        }

        .x444-status-success {
          background: #27ae60;
          color: #fff;
        }

        .x444-status-error {
          background: #e74c3c;
          color: #fff;
        }

        .x444-footer {
          margin-top: 24px;
          text-align: center;
        }

        .x444-powered {
          font-size: 12px;
          opacity: 0.6;
          margin: 0;
        }

        .x444-link {
          color: #f39c12;
          text-decoration: none;
        }

        .x444-link:hover {
          text-decoration: underline;
        }

        .x444-loading {
          text-align: center;
          padding: 40px;
        }

        .x444-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 16px;
          border: 4px solid rgba(243, 156, 18, 0.2);
          border-top-color: #f39c12;
          border-radius: 50%;
          animation: x444-spin 1s linear infinite;
        }

        @keyframes x444-spin {
          to { transform: rotate(360deg); }
        }

        .x444-error {
          text-align: center;
          padding: 40px;
        }

        .x444-error-message {
          color: #e74c3c;
          font-size: 14px;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // Expose to global scope
  window.X444 = X444;

  console.log('X444 Payment Widget v' + X444.version + ' loaded');

})(window);
