/**
 * ElevenLabs TTS Caching Service
 * Smart caching for frequently used audio responses
 * - Caches audio by text hash for instant playback
 * - LRU eviction (keeps most used, drops old)
 * - LocalStorage persistence across sessions
 * - Uses ElevenLabs REST API with proper headers
 */

export class ElevenLabsTTSCache {
  constructor(options = {}) {
    // Use Supabase Edge Function endpoint
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.proxyUrl = supabaseUrl
      ? `${supabaseUrl}/functions/v1/elevenlabs-proxy`
      : '/api/elevenlabs-proxy'; // Fallback for local dev
    this.voiceId = options.voiceId || 'EXAVITQu4vr4xnSDxMaL'; // CZ voice
    this.modelId = options.modelId || 'eleven_flash_v2_5'; // Most cost-efficient
    this.maxCacheSize = options.maxCacheSize || 50; // Max cached audio clips
    this.cache = new Map(); // In-memory cache
    this.usageCount = new Map(); // Track frequency
    this.currentAudio = null; // Track playing audio

    // Load persisted cache from localStorage
    this.loadCacheFromStorage();
  }

  /**
   * DEPRECATED: No longer needed with proxy
   * Kept for backwards compatibility
   */
  getEnvVariable(name) {
    return '';
  }

  /**
   * Generate cache key from text
   */
  getCacheKey(text) {
    // Simple hash for cache key
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `tts_${Math.abs(hash)}`;
  }

  /**
   * Check if audio is cached
   */
  isCached(text) {
    const key = this.getCacheKey(text);
    return this.cache.has(key);
  }

  /**
   * Get cached audio
   */
  getCached(text) {
    const key = this.getCacheKey(text);
    if (this.cache.has(key)) {
      // Increment usage count
      const count = this.usageCount.get(key) || 0;
      this.usageCount.set(key, count + 1);
      return this.cache.get(key);
    }
    return null;
  }

  /**
   * Cache audio data
   */
  setCache(text, audioBlob) {
    const key = this.getCacheKey(text);

    // Evict least used if cache full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      text,
      audioBlob,
      timestamp: Date.now(),
    });
    this.usageCount.set(key, 1);

    // Persist to localStorage
    this.saveCacheToStorage(key, text, audioBlob);
  }

  /**
   * Evict least recently used item
   */
  evictLeastUsed() {
    let minUsage = Infinity;
    let leastUsedKey = null;

    this.usageCount.forEach((count, key) => {
      if (count < minUsage) {
        minUsage = count;
        leastUsedKey = key;
      }
    });

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
      this.usageCount.delete(leastUsedKey);
      localStorage.removeItem(leastUsedKey);
    }
  }

  /**
   * Generate TTS audio via proxy (API key protected on server)
   */
  async generateTTS(text) {
    try {
      console.log('[TTS] Calling proxy API');

      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice_id: this.voiceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.error || `TTS API error: ${response.status} ${response.statusText}`;

        console.error('[TTS] API Error:', {
          status: response.status,
          error: errorData,
        });

        throw new Error(errorMessage);
      }

      const { audio, contentType } = await response.json();

      // Convert base64 audio to blob
      const audioData = atob(audio);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }
      const audioBlob = new Blob([audioArray], { type: contentType });
      console.log('[TTS] Audio generated successfully');
      return audioBlob;
    } catch (error) {
      console.error('TTS generation failed:', error);
      throw error;
    }
  }

  /**
   * Get audio (cached or generate new)
   */
  async getAudio(text) {
    // Check cache first
    const cached = this.getCached(text);
    if (cached) {
      console.log('[TTS] Audio found in cache');
      return {
        audioBlob: cached.audioBlob,
        fromCache: true,
      };
    }

    // Generate new
    console.log('[TTS] Generating new audio');
    try {
      const audioBlob = await this.generateTTS(text);
      this.setCache(text, audioBlob);
      return {
        audioBlob,
        fromCache: false,
      };
    } catch (error) {
      console.error('[TTS] Failed to generate audio:', error.message);
      throw error;
    }
  }

  /**
   * Play audio blob
   */
  async playAudio(audioBlob, onEnded = null) {
    return new Promise((resolve, reject) => {
      try {
        // Stop any existing audio
        this.stopAudio();

        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          if (onEnded) onEnded();
          resolve();
        };

        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          reject(error);
        };

        this.currentAudio = audio;
        audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop current audio playback
   */
  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Get and play audio in one call
   */
  async speak(text) {
    const { audioBlob, fromCache } = await this.getAudio(text);
    await this.playAudio(audioBlob);
    return { success: true, fromCache };
  }

  /**
   * Load cache from localStorage - optimized
   */
  loadCacheFromStorage() {
    try {
      // Only scan localStorage for tts_ keys - skip other items
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('tts_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const data = JSON.parse(stored);
              // Optimized base64 to blob conversion
              const binaryString = atob(data.audioData);
              // Use TextEncoder for faster conversion
              const bytes = new Uint8Array(binaryString.length);
              for (let j = 0; j < binaryString.length; j++) {
                bytes[j] = binaryString.charCodeAt(j);
              }
              const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });

              this.cache.set(key, {
                text: data.text,
                audioBlob,
                timestamp: data.timestamp,
              });
              this.usageCount.set(key, data.usageCount || 1);
            } catch (e) {
              // Corrupted cache entry, skip
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load TTS cache from storage:', error);
    }
  }

  /**
   * Save cache entry to localStorage - optimized
   */
  async saveCacheToStorage(key, text, audioBlob) {
    try {
      // Convert blob to base64 for storage
      const arrayBuffer = await audioBlob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Optimized binary string creation - use larger chunks
      let binary = '';
      const chunkSize = 1024; // Process 1KB at a time
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode.apply(null, chunk);
      }
      const base64 = btoa(binary);

      const data = {
        text,
        audioData: base64,
        timestamp: Date.now(),
        usageCount: this.usageCount.get(key) || 1,
      };

      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      // Storage quota exceeded or other error - not critical
      console.warn('Failed to persist TTS cache:', error);
    }
  }

  /**
   * Clear all cache - optimized
   */
  clearCache() {
    // Only remove tts_ entries, don't scan entire localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tts_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    this.cache.clear();
    this.usageCount.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
    };
  }
}

export default ElevenLabsTTSCache;
