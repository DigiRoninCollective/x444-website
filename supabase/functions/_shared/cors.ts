/**
 * Shared CORS headers for Supabase Edge Functions
 * Update the origin to match your production domain
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Change to your domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
