import React, { useState, useEffect } from 'react';
import { Loader, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { X444PaymentWidgetProps, X444Theme } from '../types';
import { getTheme } from '../config/themes';
import '../styles/widget.css';

const TOKEN_INFO: Record<string, { symbol: string; name: string; color: string; featured?: boolean }> = {
  // Featured tokens (show as buttons)
  '0xUSDA': { symbol: 'USDA', name: 'Aero USD', color: '#0066FF', featured: true },
  '0xX4': { symbol: 'X4', name: 'X4 Protocol', color: '#F3BA2F', featured: true },
  // Memecoins (searchable)
  '0xDEGEN': { symbol: 'DEGEN', name: 'Degen', color: '#FF6B6B' },
  '0xPEPE': { symbol: 'PEPE', name: 'Pepe', color: '#00D084' },
  '0xBRIAN': { symbol: 'BRIAN', name: 'Brian', color: '#9945FF' },
  '0xTIERO': { symbol: 'TIERO', name: 'Tiero', color: '#FF00FF' },
  '0xDAM': { symbol: 'DAM', name: 'Damn', color: '#FFAA00' },
  '0xMOG': { symbol: 'MOG', name: 'Mog', color: '#00FF99' },
};

export default function X444PaymentWidget({
  linkId,
  contractAddress,
  supportedTokens,
  isGasless,
  theme = 'dark',
  customTheme,
  onPaymentSuccess,
  onPaymentError,
  className = '',
}: X444PaymentWidgetProps) {
  const [selectedToken, setSelectedToken] = useState<string>(supportedTokens[0]);
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);

  const themeConfig = getTheme(
    theme as 'dark' | 'light',
    customTheme
  );

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to check wallet:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage('MetaMask not installed');
      setStatus('error');
      onPaymentError?.('MetaMask not installed');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setIsWalletConnected(true);
      setWalletAddress(accounts[0]);
      setMessage('Wallet connected!');
      setStatus('idle');
    } catch (error: any) {
      setMessage(error.message || 'Failed to connect wallet');
      setStatus('error');
      onPaymentError?.(error.message);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setMessage('Enter a valid amount');
      setStatus('error');
      return;
    }

    if (!isWalletConnected) {
      setMessage('Please connect your wallet');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('Processing payment...');

    try {
      // Simulate payment processing (60 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}`;
      setTxHash(mockTxHash);
      setMessage('Payment successful! 🎉');
      setStatus('success');
      onPaymentSuccess?.(mockTxHash, amount);

      // Reset form after 3 seconds
      setTimeout(() => {
        setAmount('');
        setStatus('idle');
        setMessage('');
        setTxHash('');
      }, 3000);
    } catch (error: any) {
      setMessage(error.message || 'Payment failed');
      setStatus('error');
      onPaymentError?.(error.message);
    }
  };

  const tokenInfo = TOKEN_INFO[selectedToken] || { symbol: selectedToken, name: selectedToken, color: '#999' };

  const themeStyle = {
    '--x444-primary': themeConfig.primaryColor,
    '--x444-secondary': themeConfig.secondaryColor,
    '--x444-background': themeConfig.backgroundColor,
    '--x444-surface': themeConfig.surfaceColor,
    '--x444-text': themeConfig.textColor,
    '--x444-text-secondary': themeConfig.textSecondary,
    '--x444-border': themeConfig.borderColor,
    '--x444-success': themeConfig.successColor,
    '--x444-error': themeConfig.errorColor,
    '--x444-border-radius': themeConfig.borderRadius,
    '--x444-font-size': themeConfig.fontSize,
  } as React.CSSProperties;

  return (
    <div
      className={`x444-widget ${className}`}
      style={themeStyle}
    >
      {/* Header */}
      <div className="x444-widget__header">
        <div className="x444-widget__title">
          <h3>x444 Payment</h3>
          {isGasless && <span className="x444-widget__badge">Gasless</span>}
        </div>
      </div>

      {/* Wallet Connection */}
      {!isWalletConnected ? (
        <div className="x444-widget__wallet-prompt">
          <AlertCircle size={24} />
          <p>Connect your wallet to proceed</p>
          <button
            onClick={connectWallet}
            className="x444-widget__btn x444-widget__btn--primary"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          {/* Wallet Display */}
          <div className="x444-widget__wallet-connected">
            <span>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="x444-widget__form">
            {/* Amount Input */}
            <div className="x444-widget__form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                disabled={status === 'loading'}
                className="x444-widget__input"
              />
            </div>

            {/* Token Selection */}
            <div className="x444-widget__form-group">
              <label>Token</label>

              {/* Featured Tokens (USDC, X4) */}
              <div className="x444-widget__featured-tokens">
                {supportedTokens
                  .filter(token => TOKEN_INFO[token]?.featured)
                  .map((token) => {
                    const info = TOKEN_INFO[token] || { symbol: token, name: token, color: '#999' };
                    return (
                      <button
                        key={token}
                        type="button"
                        onClick={() => {
                          setSelectedToken(token);
                          setShowTokenDropdown(false);
                        }}
                        className={`x444-widget__featured-btn ${selectedToken === token ? 'x444-widget__featured-btn--selected' : ''}`}
                        disabled={status === 'loading'}
                      >
                        <span
                          className="x444-widget__token-dot"
                          style={{ backgroundColor: info.color }}
                        />
                        <span>{info.symbol}</span>
                      </button>
                    );
                  })}
              </div>

              {/* Memecoin Search */}
              <div className="x444-widget__token-search">
                <input
                  type="text"
                  placeholder="Search memecoins..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowTokenDropdown(true);
                  }}
                  onFocus={() => setShowTokenDropdown(true)}
                  disabled={status === 'loading'}
                  className="x444-widget__search-input"
                />

                {/* Dropdown Results */}
                {showTokenDropdown && searchQuery && (
                  <div className="x444-widget__token-dropdown">
                    {supportedTokens
                      .filter(token => {
                        const info = TOKEN_INFO[token] || { symbol: token };
                        return info.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               info.name?.toLowerCase().includes(searchQuery.toLowerCase());
                      })
                      .map((token) => {
                        const info = TOKEN_INFO[token] || { symbol: token, name: token, color: '#999' };
                        return (
                          <button
                            key={token}
                            type="button"
                            onClick={() => {
                              setSelectedToken(token);
                              setShowTokenDropdown(false);
                              setSearchQuery('');
                            }}
                            className={`x444-widget__dropdown-item ${selectedToken === token ? 'x444-widget__dropdown-item--selected' : ''}`}
                          >
                            <span
                              className="x444-widget__token-dot"
                              style={{ backgroundColor: info.color }}
                            />
                            <div className="x444-widget__dropdown-text">
                              <span className="x444-widget__dropdown-symbol">{info.symbol}</span>
                              <span className="x444-widget__dropdown-name">{info.name}</span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Grid Fallback */}
              {!showTokenDropdown && !searchQuery && (
                <div className="x444-widget__token-grid">
                  {supportedTokens
                    .filter(token => !TOKEN_INFO[token]?.featured)
                    .slice(0, 4)
                    .map((token) => {
                      const info = TOKEN_INFO[token] || { symbol: token, name: token, color: '#999' };
                      return (
                        <button
                          key={token}
                          type="button"
                          onClick={() => setSelectedToken(token)}
                          className={`x444-widget__token-btn ${selectedToken === token ? 'x444-widget__token-btn--selected' : ''}`}
                          disabled={status === 'loading'}
                        >
                          <span
                            className="x444-widget__token-dot"
                            style={{ backgroundColor: info.color }}
                          />
                          <span className="x444-widget__token-symbol">{info.symbol}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Status Messages */}
            {message && (
              <div
                className={`x444-widget__message x444-widget__message--${status}`}
              >
                {status === 'loading' && <Loader size={16} className="x444-widget__spinner" />}
                {status === 'success' && <CheckCircle2 size={16} />}
                {status === 'error' && <AlertCircle size={16} />}
                <span>{message}</span>
              </div>
            )}

            {/* Transaction Hash */}
            {txHash && (
              <div className="x444-widget__tx-info">
                <p className="x444-widget__tx-label">Transaction Hash:</p>
                <div className="x444-widget__tx-hash">
                  <code>{txHash.slice(0, 10)}...{txHash.slice(-8)}</code>
                  <button
                    type="button"
                    className="x444-widget__tx-btn"
                    onClick={() => navigator.clipboard.writeText(txHash)}
                    title="Copy transaction hash"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button
              type="submit"
              disabled={!amount || status === 'loading' || status === 'success'}
              className="x444-widget__btn x444-widget__btn--primary x444-widget__btn--full"
            >
              {status === 'loading' ? (
                <>
                  <Loader size={16} className="x444-widget__spinner" />
                  Processing...
                </>
              ) : (
                `Pay ${amount || '0.00'} ${tokenInfo.symbol}`
              )}
            </button>
          </form>

          {/* Info */}
          <div className="x444-widget__info">
            <p>
              {isGasless
                ? '✓ No gas fees - customer signs offline'
                : 'Gas fees apply'}
            </p>
            <p>Protocol fee: 1% on all transactions</p>
            <p className="text-xs text-x4-silver-300 mt-1">
              Routed to x4 Protocol treasury for ecosystem development
            </p>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="x444-widget__footer">
        <p>Powered by x444</p>
        <a
          href="https://x444.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="x444-widget__footer-link"
        >
          Learn more <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
