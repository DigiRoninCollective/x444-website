/**
 * Governance Configuration
 * Controls how the widget integrates with AI governance decisions
 * Currently stubbed - will be activated when governance contract deploys
 */

import type { GovernanceConfig } from '../types'

/**
 * Global governance configuration
 * Set enabled = true when governance contract is live
 */
export const GOVERNANCE_CONFIG: GovernanceConfig = {
  // TOGGLE THIS WHEN GOVERNANCE GOES LIVE
  enabled: false,

  // API endpoint for governance decisions
  apiUrl: process.env.VITE_GOVERNANCE_API_URL || 'https://governance.x444.io/api',

  // Individual feature flags
  agentDecisions: false, // AI agents make proposals
  tokenWhitelist: false, // Use governance token approval
  feeAdjustment: false, // AI agents adjust fees
  oracleManagement: false, // AI agents manage price feeds
  riskScoring: false // AI agents score token risk
}

/**
 * Governance API endpoints
 * These are called only if governance is enabled
 */
export const GOVERNANCE_ENDPOINTS = {
  // Get list of AI-approved tokens
  approvedTokens: '/tokens/approved',

  // Get current fee rate (may vary by merchant x4 holdings)
  feeRate: '/fees/current',

  // Get AI consensus on token risk
  tokenRisk: '/tokens/:symbol/risk',

  // Get oracle configuration
  oracleConfig: '/oracles/config',

  // Get agent decisions for transparency
  agentVotes: '/decisions/:id/votes'
}

/**
 * Agent types that provide governance decisions
 */
export const AGENT_TYPES = [
  'FinancialStrategist',
  'MarketMaven',
  'TechWizard',
  'RegulatoryRanger',
  'SecuritySentinel',
  'CommunityChampion',
  'EcosystemEvangelist',
  'DataDiplomat'
] as const

/**
 * Consensus threshold for governance decisions
 * Requires at least 6/8 agents to approve (75%)
 */
export const AGENT_CONSENSUS_THRESHOLD = 0.75

/**
 * Stub for fetching governance-approved tokens
 * When enabled, this replaces the hardcoded token list
 */
export async function fetchGovernanceApprovedTokens(network: 'bsc' | 'base') {
  if (!GOVERNANCE_CONFIG.enabled || !GOVERNANCE_CONFIG.tokenWhitelist) {
    return null
  }

  try {
    const response = await fetch(`${GOVERNANCE_CONFIG.apiUrl}${GOVERNANCE_ENDPOINTS.approvedTokens}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch governance tokens:', error)
    return null
  }
}

/**
 * Stub for fetching dynamic fee rate
 * When enabled, fees may vary based on x4 token holdings or other factors
 */
export async function fetchDynamicFeeRate(
  merchantAddress: string,
  merchantX4Balance: number
): Promise<number | null> {
  if (!GOVERNANCE_CONFIG.enabled || !GOVERNANCE_CONFIG.feeAdjustment) {
    return null
  }

  try {
    const response = await fetch(`${GOVERNANCE_CONFIG.apiUrl}${GOVERNANCE_ENDPOINTS.feeRate}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantAddress,
        x4Balance: merchantX4Balance
      }),
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.feeRate
  } catch (error) {
    console.error('Failed to fetch dynamic fee:', error)
    return null
  }
}

/**
 * Stub for fetching AI consensus risk score for a token
 * When enabled, AI agents analyze token metrics and assign risk levels
 */
export async function fetchAITokenRiskScore(tokenSymbol: string): Promise<'low' | 'medium' | 'high' | null> {
  if (!GOVERNANCE_CONFIG.enabled || !GOVERNANCE_CONFIG.riskScoring) {
    return null
  }

  try {
    const endpoint = GOVERNANCE_ENDPOINTS.tokenRisk.replace(':symbol', tokenSymbol)
    const response = await fetch(`${GOVERNANCE_CONFIG.apiUrl}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    return data.riskLevel
  } catch (error) {
    console.error(`Failed to fetch risk score for ${tokenSymbol}:`, error)
    return null
  }
}

/**
 * Stub for fetching oracle configuration
 * When enabled, governance decides which oracles to use and their weights
 */
export async function fetchOracleConfig(): Promise<any | null> {
  if (!GOVERNANCE_CONFIG.enabled || !GOVERNANCE_CONFIG.oracleManagement) {
    return null
  }

  try {
    const response = await fetch(`${GOVERNANCE_CONFIG.apiUrl}${GOVERNANCE_ENDPOINTS.oracleConfig}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch oracle config:', error)
    return null
  }
}

/**
 * Log governance decision for transparency
 * Helps merchants see why certain tokens/fees are set
 */
export function logGovernanceDecision(decision: {
  type: string
  tokenSymbol?: string
  decision: string
  agents: string[]
  consensusReached: boolean
}) {
  if (!GOVERNANCE_CONFIG.enabled) return

  console.group(`🤖 x444 AI Governance Decision`)
  console.log(`Type: ${decision.type}`)
  if (decision.tokenSymbol) console.log(`Token: ${decision.tokenSymbol}`)
  console.log(`Decision: ${decision.decision}`)
  console.log(`Agent Votes:`, decision.agents)
  console.log(`Consensus: ${decision.consensusReached ? '✓ Approved' : '✗ Rejected'}`)
  console.groupEnd()
}
