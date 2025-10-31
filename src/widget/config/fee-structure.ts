/**
 * Fee Structure Configuration
 * Handles fee calculations with x4 token holder discounts
 * Integrates with governance for dynamic fee adjustment
 */

/**
 * Base fee rate: 0.5% (0.005)
 * This is the standard merchant fee for x444 payments
 * Customer always pays 0% (gasless via EIP-3009)
 */
export const BASE_FEE_RATE = 0.005

/**
 * x4 Token Holder Discount Tiers
 * Merchants can reduce their fees by holding x4 tokens
 *
 * Example: A merchant with 5,000 x4 tokens gets 25% discount
 * Original fee: 0.5% → Discounted: 0.375%
 */
export const X4_DISCOUNT_TIERS = {
  bronze: {
    minHolding: 1000, // 1,000 x4 tokens
    discountPercent: 10 // 10% discount on fees
  },
  silver: {
    minHolding: 5000, // 5,000 x4 tokens
    discountPercent: 25 // 25% discount on fees
  },
  gold: {
    minHolding: 10000, // 10,000 x4 tokens
    discountPercent: 50 // 50% discount on fees
  },
  platinum: {
    minHolding: 25000, // 25,000 x4 tokens
    discountPercent: 75 // 75% discount on fees
  }
}

/**
 * Calculate merchant fee based on transaction amount
 * Applies x4 token holder discounts
 */
export function calculateMerchantFee(
  transactionAmount: number,
  x4Holdings: number = 0,
  baseRate: number = BASE_FEE_RATE
): {
  baseAmount: number
  discountPercent: number
  finalAmount: number
  tierName: string
} {
  // Calculate base fee
  const baseAmount = transactionAmount * baseRate

  // Determine discount tier
  let discountPercent = 0
  let tierName = 'standard'

  if (x4Holdings >= X4_DISCOUNT_TIERS.platinum.minHolding) {
    discountPercent = X4_DISCOUNT_TIERS.platinum.discountPercent
    tierName = 'platinum'
  } else if (x4Holdings >= X4_DISCOUNT_TIERS.gold.minHolding) {
    discountPercent = X4_DISCOUNT_TIERS.gold.discountPercent
    tierName = 'gold'
  } else if (x4Holdings >= X4_DISCOUNT_TIERS.silver.minHolding) {
    discountPercent = X4_DISCOUNT_TIERS.silver.discountPercent
    tierName = 'silver'
  } else if (x4Holdings >= X4_DISCOUNT_TIERS.bronze.minHolding) {
    discountPercent = X4_DISCOUNT_TIERS.bronze.discountPercent
    tierName = 'bronze'
  }

  // Apply discount
  const discountAmount = baseAmount * (discountPercent / 100)
  const finalAmount = baseAmount - discountAmount

  return {
    baseAmount: parseFloat(baseAmount.toFixed(6)),
    discountPercent,
    finalAmount: parseFloat(finalAmount.toFixed(6)),
    tierName
  }
}

/**
 * Get human-readable fee breakdown
 */
export function getFeeBreakdown(
  transactionAmount: number,
  x4Holdings: number = 0
): {
  transaction: string
  baseFee: string
  discount: string
  finalFee: string
  savings: string
  tier: string
} {
  const calc = calculateMerchantFee(transactionAmount, x4Holdings)

  return {
    transaction: `$${transactionAmount.toFixed(2)}`,
    baseFee: `$${calc.baseAmount.toFixed(4)} (${(BASE_FEE_RATE * 100).toFixed(1)}%)`,
    discount: calc.discountPercent > 0 ? `${calc.discountPercent}%` : 'None',
    finalFee: `$${calc.finalAmount.toFixed(4)} (${((calc.finalAmount / transactionAmount) * 100).toFixed(3)}%)`,
    savings: calc.discountPercent > 0 ? `$${(calc.baseAmount - calc.finalAmount).toFixed(4)}` : '$0.00',
    tier: calc.tierName
  }
}

/**
 * Calculate customer payment amount (with embedded fee)
 * From the customer perspective, they just see a total amount to pay
 * The fee is embedded in the exchange rate (like Coinbase, Stripe)
 */
export function calculateCustomerPayment(
  merchantRequestAmount: number, // What merchant wants to receive
  x4Holdings: number = 0
): number {
  const feeInfo = calculateMerchantFee(merchantRequestAmount, x4Holdings)
  // Customer pays: requested amount + fee (paid by merchant, embedded in quote)
  return merchantRequestAmount + feeInfo.finalAmount
}

/**
 * Calculate next discount tier info
 * Shows merchant how much more x4 they need to reach next tier
 */
export function getNextDiscountTier(x4Holdings: number): {
  current: string
  next: string | null
  tokensNeeded: number
  savingsIfUpgraded: string
} {
  const tiers = Object.entries(X4_DISCOUNT_TIERS)
  let currentTier = 'standard'
  let nextTier = null
  let tokensNeeded = 0
  let savingsIfUpgraded = '$0'

  for (const [name, tier] of tiers) {
    if (x4Holdings >= tier.minHolding) {
      currentTier = name
    } else {
      nextTier = name
      tokensNeeded = tier.minHolding - x4Holdings
      break
    }
  }

  // Calculate savings at next tier
  if (nextTier) {
    const currentDiscount = calculateMerchantFee(100, x4Holdings).discountPercent
    const nextDiscount = X4_DISCOUNT_TIERS[nextTier as keyof typeof X4_DISCOUNT_TIERS].discountPercent
    const savingsPer100 = (nextDiscount - currentDiscount) * 0.005 // 0.5% base fee
    savingsIfUpgraded = `$${(savingsPer100 * 100).toFixed(4)} per $10,000`
  }

  return {
    current: currentTier,
    next: nextTier,
    tokensNeeded,
    savingsIfUpgraded
  }
}

/**
 * Get all discount tier information
 * Useful for showing merchants available tiers
 */
export function getAllDiscountTiers() {
  return Object.entries(X4_DISCOUNT_TIERS).map(([name, tier]) => ({
    name,
    minHolding: tier.minHolding,
    discountPercent: tier.discountPercent,
    effectiveRate: (BASE_FEE_RATE * (1 - tier.discountPercent / 100) * 100).toFixed(3)
  }))
}
