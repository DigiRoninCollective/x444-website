/**
 * x444 Widget Configuration - Multi-Chain Support
 *
 * Copy this to widget-config.js and update with your values
 * DO NOT commit widget-config.js to git (add to .gitignore)
 */

const X444_CONFIG = {
  // Development mode (uses placeholder/mock payments)
  development: {
    mode: 'placeholder',
    chains: {
      bnb: {
        enabled: false,
        network: 'bnb-testnet',
        chainId: 97,
        rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        contractAddress: '', // Not deployed yet
        apiEndpoint: '', // Not set up yet
        blockExplorer: 'https://testnet.bscscan.com',
        wallet: 'MetaMask'
      },
      solana: {
        enabled: false,
        network: 'devnet',
        cluster: 'devnet',
        rpcUrl: 'https://api.devnet.solana.com',
        programId: '', // Not deployed yet
        apiEndpoint: '', // Not set up yet
        blockExplorer: 'https://explorer.solana.com/?cluster=devnet',
        wallet: 'Phantom'
      }
    }
  },

  // Production mode (uses real blockchain)
  production: {
    mode: 'live',
    chains: {
      bnb: {
        enabled: true,
        network: 'bnb-mainnet',
        chainId: 56,
        rpcUrl: 'https://bsc-dataseed.binance.org/',
        contractAddress: '0x_______________', // UPDATE: Your deployed contract address
        apiEndpoint: 'https://bvuauqwgodbesyfswiun.supabase.co/functions/v1/pay-gasless-bnb',
        blockExplorer: 'https://bscscan.com',
        wallet: 'MetaMask',
        gasCost: 0.30 // USD
      },
      solana: {
        enabled: true,
        network: 'mainnet-beta',
        cluster: 'mainnet-beta',
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        programId: '_______________', // UPDATE: Your deployed program ID
        apiEndpoint: 'https://bvuauqwgodbesyfswiun.supabase.co/functions/v1/pay-gasless-solana',
        blockExplorer: 'https://solscan.io',
        wallet: 'Phantom',
        gasCost: 0.0001 // USD (100x cheaper!)
      }
    },
    // Automatic chain selection based on transaction size
    autoSelectChain: true,
    chainSelectionRules: {
      // Use Solana for transactions < $30 (better UX, lower gas)
      useSolanaUnder: 30,
      // Use BNB for transactions >= $30 or if user prefers
      useBnbAbove: 30
    }
  },

  // Current active environment
  current: 'development' // Change to 'production' when ready
};

// Export the active config
export default X444_CONFIG[X444_CONFIG.current];

/**
 * Usage in widget.js:
 *
 * import CONFIG from './widget-config.js';
 *
 * if (CONFIG.mode === 'placeholder') {
 *   // Use mock payment flow
 *   await simulatePayment();
 * } else {
 *   // Use real blockchain payment
 *   await customerGaslessPaymentFlow(
 *     signer,
 *     linkId,
 *     token,
 *     amount,
 *     CONFIG.contractAddress,
 *     CONFIG.chainId,
 *     CONFIG.apiEndpoint
 *   );
 * }
 */
