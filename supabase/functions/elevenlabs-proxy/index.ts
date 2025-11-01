import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

/**
 * ElevenLabs API Proxy - Supabase Edge Function
 * Protects your ElevenLabs API key server-side
 * Rate limiting handled by Supabase automatically
 */

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice_id } = await req.json()

    // Validate input
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid text parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Limit text length
    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text too long (max 5000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get API key and voice ID from Supabase secrets
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    const elevenLabsVoiceId = voice_id || Deno.env.get('ELEVENLABS_VOICE_ID') || 'EXAVITQu4vr4xnSDxMaL'

    if (!elevenLabsApiKey) {
      console.error('ELEVENLABS_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('ElevenLabs API error:', error)
      return new Response(
        JSON.stringify({
          error: 'Failed to generate speech',
          details: response.statusText
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get audio data
    const audioArrayBuffer = await response.arrayBuffer()
    const audioArray = new Uint8Array(audioArrayBuffer)

    // Convert to base64
    let binary = ''
    const len = audioArray.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(audioArray[i])
    }
    const audioBase64 = btoa(binary)

    return new Response(
      JSON.stringify({
        audio: audioBase64,
        contentType: 'audio/mpeg'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('ElevenLabs proxy error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
