import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Plus, Trash2, ToggleLeft, ToggleRight, ExternalLink, Loader, Star, Zap, Image, ShoppingCart, Hammer, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';
import { PAYMENT_PRESETS, PresetType, type PaymentPreset } from '../config/paymentPresets';
import { useToast } from '../components/ToastContainer';

// Extend Window type for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface PaymentLink {
  linkId: number;
  creator: string;
  contractAddress: string;
  linkName: string;
  supportedTokens: string[];
  feeRecipient: string;
  createdAt: number;
  active: boolean;
}

interface ConnectingState {
  isConnecting: boolean;
  error: string | null;
}

export default function CreatorDashboard() {
  const { addToast } = useToast();
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [connecting, setConnecting] = useState<ConnectingState>({ isConnecting: false, error: null });

  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkNameError, setLinkNameError] = useState('');
  const [selectedTokens, setSelectedTokens] = useState<string[]>(['0xDEGEN']);
  const [creatingLink, setCreatingLink] = useState(false);
  const [createError, setCreateError] = useState('');
  const [contractMode, setContractMode] = useState<'preset' | 'factory' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<PresetType>(PresetType.CREATOR_BASIC);
  const [customContractAddress, setCustomContractAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Available tokens on Base
  const availableTokens = [
    { address: '0xDEGEN', symbol: 'DEGEN', name: 'Degen' },
    { address: '0xPEPE', symbol: 'PEPE', name: 'Pepe' },
    { address: '0xX4', symbol: 'X4', name: 'X4 Protocol' },
    { address: '0xUSDA', symbol: 'USDA', name: 'Aero USD' },
  ];

  // ============ Wallet Connection ============
  const connectWallet = async () => {
    setConnecting({ isConnecting: true, error: null });
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      setUserAddress(address);
      setWalletConnected(true);

      // Load user's payment links
      await loadUserLinks(address);
    } catch (error: any) {
      setConnecting({ isConnecting: false, error: error.message });
    } finally {
      setConnecting({ isConnecting: false, error: null });
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setUserAddress('');
    setLinks([]);
  };

  // ============ Load User Links (Placeholder) ============
  const loadUserLinks = async (address: string) => {
    setLoadingLinks(true);
    try {
      // TODO: Call factory contract to get creatorLinks[address]
      // For now, return empty array
      setLinks([]);
    } catch (error) {
      console.error('Failed to load links:', error);
    } finally {
      setLoadingLinks(false);
    }
  };

  // ============ Create Payment Link ============
  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setLinkNameError('');
    setAddressError('');

    if (!linkName.trim()) {
      setLinkNameError('Link name is required');
      setCreateError('Link name is required');
      addToast('Link name is required', 'error');
      return;
    }

    if (selectedTokens.length === 0) {
      setCreateError('Select at least one token');
      addToast('Select at least one token', 'error');
      return;
    }

    if (contractMode === 'custom' && !customContractAddress.trim()) {
      setAddressError('Custom contract address is required');
      setCreateError('Custom contract address is required');
      addToast('Custom contract address is required', 'error');
      return;
    }

    if (contractMode === 'custom' && !ethers.isAddress(customContractAddress)) {
      setAddressError('Invalid contract address');
      setCreateError('Invalid contract address');
      addToast('Invalid Ethereum address format', 'error');
      return;
    }

    setCreatingLink(true);
    try {
      let contractAddress = '';

      if (contractMode === 'preset') {
        // Use preset contract
        const preset = PAYMENT_PRESETS[selectedPreset];
        contractAddress = preset.contractAddress;
      } else if (contractMode === 'factory') {
        // TODO: Call factory contract createPaymentLink() with vanity address generation
        contractAddress = '0x' + Math.random().toString(16).slice(2);
      } else {
        // Use custom contract
        contractAddress = customContractAddress;
      }

      const newLink: PaymentLink = {
        linkId: links.length,
        creator: userAddress,
        contractAddress,
        linkName,
        supportedTokens: selectedTokens,
        feeRecipient: userAddress,
        createdAt: Date.now(),
        active: true,
      };

      setLinks([...links, newLink]);
      addToast(`Payment link "${linkName}" created successfully!`, 'success');

      setLinkName('');
      setSelectedTokens(['0xDEGEN']);
      setCustomContractAddress('');
      setContractMode('preset');
      setShowCreateForm(false);
    } catch (error: any) {
      setCreateError(error.message);
    } finally {
      setCreatingLink(false);
    }
  };

  // ============ Copy Widget Code ============
  const copyWidgetCode = (link: PaymentLink) => {
    const reactCode = `import { X444PaymentWidget } from '@x444/widget';

export default function PaymentPage() {
  return (
    <X444PaymentWidget
      linkId="${link.linkId}"
      contractAddress="${link.contractAddress}"
      supportedTokens={[
        ${link.supportedTokens.map(addr => `"${addr}"`).join(',\n        ')}
      ]}
      isGasless={true}
      theme="dark"
      onPaymentSuccess={(txHash, amount) => {
        console.log('Payment successful!', txHash, amount);
      }}
    />
  );
}`;

    navigator.clipboard.writeText(reactCode);
    setCopiedCode(link.contractAddress);
    addToast('Widget code copied to clipboard!', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // ============ Toggle Link Active Status ============
  const toggleLinkStatus = (linkId: number) => {
    setLinks(prev =>
      prev.map(link =>
        link.linkId === linkId
          ? { ...link, active: !link.active }
          : link
      )
    );
    const link = links.find(l => l.linkId === linkId);
    if (link) {
      addToast(
        `Payment link "${link.linkName}" is now ${!link.active ? 'active' : 'inactive'}`,
        'success'
      );
    }
  };

  // ============ Delete Link ============
  const deleteLink = (linkId: number) => {
    const link = links.find(l => l.linkId === linkId);
    setLinks(prev => prev.filter(l => l.linkId !== linkId));
    if (link) {
      addToast(`Payment link "${link.linkName}" deleted`, 'info');
    }
  };

  return (
    <div className="space-y-20 py-20">
      {/* Header */}
      <section className="px-6 pt-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-x4-gold-400 mb-6">
            Creator Dashboard
          </h1>
          <p className="text-xl text-x4-silver-400 max-w-3xl">
            Create and manage memocoin payment links. Earn 1% on every transaction. No fees, fully decentralized.
          </p>
        </div>
      </section>

      {/* Wallet Connection */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto">
          {!walletConnected ? (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/30 rounded-xl p-12 text-center">
              <h2 className="text-2xl font-bold text-x4-gold-400 mb-4">Connect Your Wallet</h2>
              <p className="text-x4-silver-400 mb-8 max-w-2xl mx-auto">
                Sign in with your wallet to create payment links and start earning memocoin payments.
                No signup, no KYC, no fees. Just connect and go.
              </p>
              <button
                onClick={connectWallet}
                disabled={connecting.isConnecting}
                className="px-8 py-3 bg-x4-gold-500 hover:bg-x4-gold-600 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {connecting.isConnecting ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect MetaMask'
                )}
              </button>
              {connecting.error && (
                <p className="text-red-400 mt-4">{connecting.error}</p>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="text-x4-silver-400 text-sm uppercase tracking-wide">Connected Wallet</p>
                <p className="text-white font-mono text-sm mt-1">{userAddress}</p>
              </div>
              <button
                onClick={disconnectWallet}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </section>

      {walletConnected && (
        <>
          {/* Create New Link */}
          <section className="px-6">
            <div className="max-w-5xl mx-auto">
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-x4-gold-500 hover:bg-x4-gold-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <Plus size={20} />
                  Create New Payment Link
                </button>
              ) : (
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-x4-gold-400 mb-6">Create Payment Link</h2>
                  <form onSubmit={handleCreateLink} className="space-y-6">
                    {/* Link Name */}
                    <div>
                      <label className="block text-x4-silver-400 font-semibold mb-2">
                        Link Name
                      </label>
                      <input
                        type="text"
                        value={linkName}
                        onChange={(e) => {
                          setLinkName(e.target.value);
                          if (e.target.value.trim().length === 0) {
                            setLinkNameError('Link name is required');
                          } else if (e.target.value.trim().length < 3) {
                            setLinkNameError('Link name must be at least 3 characters');
                          } else {
                            setLinkNameError('');
                          }
                        }}
                        placeholder="e.g., NFT Drop #1, Premium Content, etc."
                        className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-colors ${
                          linkNameError
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-slate-700 focus:border-x4-gold-400'
                        }`}
                      />
                      {linkNameError && (
                        <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span className="text-sm text-red-300">{linkNameError}</span>
                        </div>
                      )}
                    </div>

                    {/* Contract Selection */}
                    <div>
                      <label className="block text-x4-silver-400 font-semibold mb-3">
                        Payment Contract Type
                      </label>
                      <div className="space-y-3 mb-4">
                        {/* Preset Option */}
                        <button
                          type="button"
                          onClick={() => setContractMode('preset')}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            contractMode === 'preset'
                              ? 'border-x4-gold-400 bg-x4-gold-500/10'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white">Use Preset Contract</p>
                              <p className="text-xs text-slate-400 mt-1">Ready-to-use contracts with optimized features</p>
                            </div>
                            <Zap size={24} className="text-x4-gold-400" />
                          </div>
                        </button>

                        {/* Factory Option */}
                        <button
                          type="button"
                          onClick={() => setContractMode('factory')}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            contractMode === 'factory'
                              ? 'border-x4-gold-400 bg-x4-gold-500/10'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white">Deploy with Factory</p>
                              <p className="text-xs text-slate-400 mt-1">Get a vanity x4 address (costs gas)</p>
                            </div>
                            <Hammer size={24} className="text-x4-gold-400" />
                          </div>
                        </button>

                        {/* Custom Option */}
                        <button
                          type="button"
                          onClick={() => setContractMode('custom')}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            contractMode === 'custom'
                              ? 'border-x4-gold-400 bg-x4-gold-500/10'
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white">Use Custom Contract</p>
                              <p className="text-xs text-slate-400 mt-1">Your own X444 contract address</p>
                            </div>
                            <Hammer size={24} className="text-slate-400" />
                          </div>
                        </button>
                      </div>

                      {/* Preset Selection */}
                      {contractMode === 'preset' && (
                        <div>
                          <label className="block text-x4-silver-400 font-semibold mb-3 text-sm">
                            Select Preset
                          </label>
                          <div className="space-y-2">
                            {Object.values(PAYMENT_PRESETS).map((preset) => (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => setSelectedPreset(preset.id as PresetType)}
                                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                                  selectedPreset === preset.id
                                    ? 'border-x4-gold-400 bg-x4-gold-500/10'
                                    : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      {preset.id === PresetType.CREATOR_BASIC && <Zap size={18} className="text-x4-gold-400" />}
                                      {preset.id === PresetType.NFT_DROP && <Image size={18} className="text-x4-gold-400" />}
                                      {preset.id === PresetType.ECOMMERCE && <ShoppingCart size={18} className="text-x4-gold-400" />}
                                      <span className="font-semibold text-white">{preset.name}</span>
                                      {preset.recommended && (
                                        <span className="flex items-center gap-1 text-xs bg-x4-gold-500/20 text-x4-gold-300 px-2 py-1 rounded">
                                          <Star size={12} />
                                          Recommended
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-400">{preset.description}</p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Custom Contract Input */}
                      {contractMode === 'custom' && (
                        <div>
                          <input
                            type="text"
                            value={customContractAddress}
                            onChange={(e) => {
                              setCustomContractAddress(e.target.value);
                              if (e.target.value.trim() === '') {
                                setAddressError('Contract address is required');
                              } else if (!ethers.isAddress(e.target.value)) {
                                setAddressError('Invalid Ethereum address format (should start with 0x)');
                              } else {
                                setAddressError('');
                              }
                            }}
                            placeholder="0x..."
                            className={`w-full px-4 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:outline-none font-mono text-sm transition-colors ${
                              addressError
                                ? 'border-red-500/60 focus:border-red-500'
                                : 'border-slate-700 focus:border-x4-gold-400'
                            }`}
                          />
                          {addressError && (
                            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <span className="text-sm text-red-300">{addressError}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Token Selection */}
                    <div>
                      <label className="block text-x4-silver-400 font-semibold mb-3">
                        Accept Payments In
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableTokens.map((token) => (
                          <button
                            key={token.address}
                            type="button"
                            onClick={() => {
                              if (selectedTokens.includes(token.address)) {
                                setSelectedTokens(
                                  selectedTokens.filter((t) => t !== token.address)
                                );
                              } else {
                                setSelectedTokens([...selectedTokens, token.address]);
                              }
                            }}
                            className={`p-3 rounded-lg border-2 transition-all text-center ${
                              selectedTokens.includes(token.address)
                                ? 'border-x4-gold-400 bg-x4-gold-500/10'
                                : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                            }`}
                          >
                            <p className="font-semibold text-white">{token.symbol}</p>
                            <p className="text-xs text-slate-400">{token.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {createError && (
                      <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                        <p className="text-red-400 text-sm">{createError}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-6">
                      <button
                        type="submit"
                        disabled={creatingLink}
                        className="flex-1 px-6 py-3 bg-x4-gold-500 hover:bg-x4-gold-600 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {creatingLink ? (
                          <>
                            <Loader size={20} className="animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Link'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setCreateError('');
                        }}
                        className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </section>

          {/* My Payment Links */}
          <section className="px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-x4-gold-400 mb-8">My Payment Links</h2>

              {loadingLinks ? (
                <div className="text-center py-12">
                  <Loader size={32} className="animate-spin mx-auto text-x4-gold-400 mb-4" />
                  <p className="text-x4-silver-400">Loading your links...</p>
                </div>
              ) : links.length === 0 ? (
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 rounded-xl p-12 text-center">
                  <p className="text-x4-silver-400 mb-4">No payment links yet</p>
                  <p className="text-slate-500 text-sm">Create your first payment link to start accepting memocoin payments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {links.map((link) => (
                    <div
                      key={link.contractAddress}
                      className="bg-gradient-to-br from-slate-900/80 to-slate-900/60 border border-x4-gold-500/20 hover:border-x4-gold-500/50 rounded-xl p-6 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-x4-gold-400">{link.linkName}</h3>
                          <p className="text-x4-silver-400 text-sm mt-1 font-mono">
                            {link.contractAddress.slice(0, 10)}...{link.contractAddress.slice(-8)}
                          </p>
                        </div>
                        <a
                          href={`https://basescan.org/address/${link.contractAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View on Basescan"
                        >
                          <ExternalLink size={20} className="text-x4-gold-400" />
                        </a>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Status</p>
                          <p className="text-white font-semibold">
                            {link.active ? '🟢 Active' : '🔴 Inactive'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Tokens</p>
                          <p className="text-white font-semibold">{link.supportedTokens.length}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Your Earnings</p>
                          <p className="text-x4-gold-400 font-semibold">+1%</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs uppercase">Created</p>
                          <p className="text-white font-semibold">
                            {new Date(link.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => copyWidgetCode(link)}
                          className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          {copiedCode === link.contractAddress ? (
                            <>
                              <CheckCircle2 size={18} className="text-green-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={18} />
                              Copy Widget Code
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => toggleLinkStatus(link.linkId)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          title={link.active ? 'Deactivate' : 'Reactivate'}
                        >
                          {link.active ? (
                            <>
                              <ToggleRight size={18} className="text-x4-gold-400" />
                              Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={18} className="text-slate-500" />
                              Inactive
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deleteLink(link.linkId)}
                          className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          title="Delete link"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Info Box */}
          <section className="px-6">
            <div className="max-w-5xl mx-auto bg-x4-gold-500/5 border border-x4-gold-500/30 rounded-xl p-8">
              <h3 className="text-lg font-bold text-x4-gold-400 mb-4">How It Works</h3>
              <ol className="space-y-3 text-x4-silver-400 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-x4-gold-400 flex-shrink-0">1.</span>
                  <span>Create a payment link - Configure the name and tokens you want to accept</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-x4-gold-400 flex-shrink-0">2.</span>
                  <span>Copy the widget code - Embed it into your website or product</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-x4-gold-400 flex-shrink-0">3.</span>
                  <span>Earn 1% on every payment - Money goes directly to your wallet</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-x4-gold-400 flex-shrink-0">4.</span>
                  <span>No platform fees - It's fully decentralized and permissionless</span>
                </li>
              </ol>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
