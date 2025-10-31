/**
 * x444 Widget Type Definitions
 * Core types for payment flow, tokens, governance, and wallet integration
 */

export interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  marketCap?: number
  logoUrl?: string
  riskScore?: 'low' | 'medium' | 'high'
  network?: 'bsc' | 'base' | 'ethereum'
}

export interface PaymentQuote {
  id: string
  tokenIn: Token
  tokenOut?: Token // For stablecoin conversion
  amountIn: string
  amountOut: string
  exchangeRate: number
  slippageTolerance: number // Percentage
  expiresAt: number // Unix timestamp (60 seconds from generation)
  createdAt: number
}

export interface PaymentRequest {
  merchantAddress: string
  amount: number
  currency: 'USD' | 'EUR' | 'GBP' // Fiat currency
  token: Token
  quote: PaymentQuote
  metadata?: Record<string, string>
}

export interface PaymentSignature {
  hash: string
  signature: string
  nonce: number
  deadline: number // EIP-712 deadline
  verified: boolean
}

export interface PaymentStatus {
  status: 'idle' | 'quoting' | 'pending_signature' | 'confirming' | 'confirmed' | 'error'
  transactionHash?: string
  confirmations?: number
  error?: string
  message?: string
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  network: number | null
  balance?: string
  error?: string
}

// Governance Types
export interface GovernanceConfig {
  enabled: boolean
  apiUrl: string
  agentDecisions: boolean
  tokenWhitelist: boolean
  feeAdjustment: boolean
  oracleManagement: boolean
  riskScoring: boolean
}

export interface AgentDecision {
  agentType:
    | 'FinancialStrategist'
    | 'MarketMaven'
    | 'TechWizard'
    | 'RegulatoryRanger'
    | 'SecuritySentinel'
    | 'CommunityChampion'
    | 'EcosystemEvangelist'
    | 'DataDiplomat'
  decision: 'approve' | 'reject' | 'review'
  reasoning: string
  confidence: number // 0-1
  timestamp: number
}

export interface GovernanceDecision {
  id: string
  type: 'token_whitelist' | 'fee_adjustment' | 'oracle_change' | 'risk_score'
  status: 'proposed' | 'voting' | 'passed' | 'rejected'
  agentVotes: AgentDecision[]
  consensusThreshold: number
  executedAt?: number
}

export interface X444PaymentButtonProps {
  // Required
  amount: number // USD amount
  merchantAddress: string

  // Optional
  currency?: 'USD' | 'EUR' | 'GBP'
  supportedTokens?: Token[] // Override defaults
  onSuccess?: (tx: PaymentStatus) => void
  onError?: (error: string) => void
  onStatusChange?: (status: PaymentStatus) => void

  // UI Customization
  className?: string
  buttonText?: string
  buttonVariant?: 'primary' | 'secondary' | 'outline'

  // Config
  network?: 'bsc' | 'base'
  rpcUrl?: string
  facilitatorAddress?: string
}

export interface X444WidgetConfig {
  network: 'bsc' | 'base'
  rpcUrl: string
  facilitatorAddress: string
  governance: GovernanceConfig
  tokens: {
    default: Token[]
    approved: Token[] // From governance
    rejected: string[] // Token symbols
  }
  fees: {
    baseRate: number // 0.005 = 0.5%
    discount: {
      bronze: number // 10% discount (1k+ x4 holdings)
      silver: number // 25% discount (5k+ x4 holdings)
      gold: number // 50% discount (10k+ x4 holdings)
      platinum: number // 75% discount (25k+ x4 holdings)
    }
  }
  oracles: {
    primary: 'coingecko' | 'governance'
    fallback: 'coingecko' | 'chainlink'
    cacheTime: number // seconds
  }
}

export interface PaymentWidgetContextType {
  config: X444WidgetConfig
  wallet: WalletState
  quote: PaymentQuote | null
  status: PaymentStatus
  setWallet: (wallet: WalletState) => void
  setQuote: (quote: PaymentQuote | null) => void
  setStatus: (status: PaymentStatus) => void
}

// Theme Types for X444PaymentWidget
export interface X444Theme {
  primaryColor: string // Main button and accent color
  secondaryColor: string // Secondary elements
  backgroundColor: string // Widget background
  surfaceColor: string // Card/panel backgrounds
  textColor: string // Primary text
  textSecondary: string // Secondary text
  borderColor: string // Borders
  successColor: string // Success states
  errorColor: string // Error states
  warningColor: string // Warning states
  borderRadius: string // Border radius (e.g., "12px")
  fontSize: string // Base font size (e.g., "14px")
}

export interface X444PaymentWidgetProps {
  linkId: string
  contractAddress: string
  supportedTokens: string[]
  isGasless: boolean
  theme?: 'dark' | 'light' | 'custom'
  customTheme?: Partial<X444Theme>
  onPaymentSuccess?: (txHash: string, amount: string) => void
  onPaymentError?: (error: string) => void
  className?: string
}
