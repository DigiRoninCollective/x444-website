/**
 * Default Token Configuration
 * Hardcoded fallback for widget initialization
 * These are the top memecoins by market cap (Oct 2025)
 */

import type { Token } from '../types'

export const DEFAULT_TOKENS_BSC: Token[] = [
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    address: '0xba2ae424d960c26247dd6c32edc70b295c744c43',
    decimals: 8,
    marketCap: 26960000000,
    logoUrl: 'https://cdn.x444.io/tokens/doge.svg',
    riskScore: 'low',
    network: 'bsc'
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    address: '0x2859e4544c4bb03966803b044a93563bd2d0dd4d',
    decimals: 18,
    marketCap: 7880000000,
    logoUrl: 'https://cdn.x444.io/tokens/shib.svg',
    riskScore: 'low',
    network: 'bsc'
  },
  {
    symbol: 'PEPE',
    name: 'Pepe',
    address: '0x25a0fb9b596dc7f4c4c7c32220f5a0500990a53d',
    decimals: 18,
    marketCap: 3250000000,
    logoUrl: 'https://cdn.x444.io/tokens/pepe.svg',
    riskScore: 'medium',
    network: 'bsc'
  },
  {
    symbol: 'FLOKI',
    name: 'Floki',
    address: '0xfb5b838b6cfeedc2873ab27866079ac55363d37e',
    decimals: 8,
    marketCap: 940000000,
    logoUrl: 'https://cdn.x444.io/tokens/floki.svg',
    riskScore: 'medium',
    network: 'bsc'
  },
  {
    symbol: 'TST',
    name: 'Test Token',
    address: '0x4b33a41b2d5267b8f1648d39f5d22dc13074e1db',
    decimals: 18,
    marketCap: 500000000,
    logoUrl: 'https://cdn.x444.io/tokens/tst.svg',
    riskScore: 'high', // Newer token, higher risk
    network: 'bsc'
  },
  {
    symbol: 'BABYDOGE',
    name: 'Baby Doge Coin',
    address: '0xaa6e8127831c59e16e3491cd9b213c7f7d5aa20f',
    decimals: 9,
    marketCap: 100000000,
    logoUrl: 'https://cdn.x444.io/tokens/babydoge.svg',
    riskScore: 'medium',
    network: 'bsc'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    decimals: 18,
    logoUrl: 'https://cdn.x444.io/tokens/usdc.svg',
    riskScore: 'low',
    network: 'bsc'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    address: '0x55d398326f99059ff775485246999027b3197955',
    decimals: 18,
    logoUrl: 'https://cdn.x444.io/tokens/usdt.svg',
    riskScore: 'low',
    network: 'bsc'
  }
]

export const DEFAULT_TOKENS_BASE: Token[] = [
  {
    symbol: 'BRETT',
    name: 'Brett',
    address: '0x532f06ff0eeae7ce8ca6c4e2c63c7855e2e79326',
    decimals: 18,
    marketCap: 610000000,
    logoUrl: 'https://cdn.x444.io/tokens/brett.svg',
    riskScore: 'medium',
    network: 'base'
  },
  {
    symbol: 'TOSHI',
    name: 'Toshi',
    address: '0x1b948a72bd91e9d3c3c9a1aae96d61761e8c0666',
    decimals: 18,
    marketCap: 271000000,
    logoUrl: 'https://cdn.x444.io/tokens/toshi.svg',
    riskScore: 'medium',
    network: 'base'
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefc7',
    decimals: 8,
    marketCap: 26960000000,
    logoUrl: 'https://cdn.x444.io/tokens/doge.svg',
    riskScore: 'low',
    network: 'base'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b1566469c3d',
    decimals: 6,
    logoUrl: 'https://cdn.x444.io/tokens/usdc.svg',
    riskScore: 'low',
    network: 'base'
  }
]

/**
 * Get default tokens for a specific network
 */
export function getDefaultTokens(network: 'bsc' | 'base'): Token[] {
  return network === 'base' ? DEFAULT_TOKENS_BASE : DEFAULT_TOKENS_BSC
}

/**
 * Find token by symbol
 */
export function findTokenBySymbol(symbol: string, network: 'bsc' | 'base' = 'bsc'): Token | undefined {
  return getDefaultTokens(network).find((t) => t.symbol === symbol)
}

/**
 * Filter tokens by risk score
 */
export function filterTokensByRisk(
  tokens: Token[],
  maxRiskLevel: 'low' | 'medium' | 'high'
): Token[] {
  const riskLevels = { low: 1, medium: 2, high: 3 }
  const maxLevel = riskLevels[maxRiskLevel]

  return tokens.filter((t) => {
    const tokenLevel = riskLevels[t.riskScore || 'medium']
    return tokenLevel <= maxLevel
  })
}
