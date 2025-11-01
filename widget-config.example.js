/**
 * x444 Widget Configuration
 *
 * Copy this to widget-config.js and update with your values
 * DO NOT commit widget-config.js to git (add to .gitignore)
 */

const X444_CONFIG = {
  // Development mode (uses placeholder/mock payments)
  development: {
    mode: 'placeholder',
    network: 'bnb-testnet',
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    contractAddress: '', // Not deployed yet
    apiEndpoint: '', // Not set up yet
    blockExplorer: 'https://testnet.bscscan.com'
  },

  // Production mode (uses real BNB Chain)
  production: {
    mode: 'live',
    network: 'bnb-mainnet',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    contractAddress: '0x_______________', // UPDATE: Your deployed contract address
    apiEndpoint: 'https://bvuauqwgodbesyfswiun.supabase.co/functions/v1',
    blockExplorer: 'https://bscscan.com'
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
