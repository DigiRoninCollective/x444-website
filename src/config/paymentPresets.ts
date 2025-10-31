/**
 * X444 Payment Preset Contracts
 * Three pre-deployed contracts with different feature sets
 */

export enum PresetType {
  CREATOR_BASIC = 'creator-basic',
  NFT_DROP = 'nft-drop',
  ECOMMERCE = 'ecommerce',
}

export interface PaymentPreset {
  id: PresetType;
  name: string;
  description: string;
  contractAddress: string;
  chainId: number;
  features: string[];
  estimatedGasCost: string;
  recommended: boolean;
  use_cases: string[];
  tokens_supported: number;
  max_transactions_per_day?: number;
}

/**
 * Preset Contracts on Base Mainnet
 * These are pre-deployed contracts that users can immediately use
 */
export const PAYMENT_PRESETS: Record<PresetType, PaymentPreset> = {
  [PresetType.CREATOR_BASIC]: {
    id: PresetType.CREATOR_BASIC,
    name: 'Creator Basic',
    description: 'Perfect for content creators, indie developers, and small businesses',
    contractAddress: '0x444444444444444444444444444444444444444444', // Placeholder - update after deployment
    chainId: 8453, // Base mainnet
    features: [
      'Gasless Payments (EIP-3009)',
      '1% earnings per transaction',
      'Support for 10+ tokens',
      'Automatic payouts to wallet',
      'Simple to integrate',
      'Perfect for creators',
    ],
    estimatedGasCost: 'FREE',
    recommended: true,
    use_cases: ['Content Creator', 'Indie Developer', 'Freelancer', 'Small Business'],
    tokens_supported: 10,
  },

  [PresetType.NFT_DROP]: {
    id: PresetType.NFT_DROP,
    name: 'NFT Drop',
    description: 'Advanced features for NFT projects with access control and batch support',
    contractAddress: '0x4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a', // Placeholder - update after deployment
    chainId: 8453,
    features: [
      'Whitelist/Blacklist Support',
      'Batch Transaction Processing',
      'Access Control & Gating',
      'Burn Mechanics',
      'Collection-based Discounts',
      'Advanced Security',
    ],
    estimatedGasCost: 'FREE',
    recommended: false,
    use_cases: ['NFT Creator', 'Art Project', 'Collection Drop', 'Exclusive Access'],
    tokens_supported: 15,
    max_transactions_per_day: 1000,
  },

  [PresetType.ECOMMERCE]: {
    id: PresetType.ECOMMERCE,
    name: 'E-Commerce',
    description: 'Full-featured payment system for online stores with inventory tracking',
    contractAddress: '0x4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e', // Placeholder - update after deployment
    chainId: 8453,
    features: [
      'Inventory Management',
      'Order Tracking & Webhooks',
      'Shipping Integration',
      'Discount & Coupon Support',
      'Multi-currency Support',
      'Advanced Analytics',
    ],
    estimatedGasCost: 'FREE',
    recommended: false,
    use_cases: ['E-Commerce Store', 'Online Shop', 'Digital Goods', 'Subscription Service'],
    tokens_supported: 20,
    max_transactions_per_day: 10000,
  },
};

/**
 * Get preset by ID
 */
export function getPreset(id: PresetType): PaymentPreset | null {
  return PAYMENT_PRESETS[id] || null;
}

/**
 * Get all presets
 */
export function getAllPresets(): PaymentPreset[] {
  return Object.values(PAYMENT_PRESETS);
}

/**
 * Get recommended preset
 */
export function getRecommendedPreset(): PaymentPreset {
  return PAYMENT_PRESETS[PresetType.CREATOR_BASIC];
}

/**
 * Get presets by use case
 */
export function getPresetsByUseCase(useCase: string): PaymentPreset[] {
  return getAllPresets().filter((preset) =>
    preset.use_cases.some((uc) =>
      uc.toLowerCase().includes(useCase.toLowerCase())
    )
  );
}
