export class SoundService {
  private context: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private musicVolume: number = 0.15; // 15% volume for background music (lowered to not overpower sound effects)
  private unlockAudioElement: HTMLAudioElement | null = null; // Used to unlock audio on mobile
  
  // Detect if device is mobile
  private isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    // Check user agent
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
    
    // Check for touch support and screen size
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    
    return isMobileUA || (hasTouch && isSmallScreen);
  }
  
  // Get device-specific music volume
  private getMusicVolume(): number {
    // Lower volume on mobile devices - make it very quiet
    const isMobile = this.isMobileDevice();
    const volume = isMobile ? 0.01 : 0.15; // 1% on mobile, 15% on desktop
    console.log(`Music volume set to ${(volume * 100).toFixed(0)}% (${isMobile ? 'mobile' : 'desktop'})`);
    return volume;
  }
  
  // Get device-specific sound effect volume (louder on mobile)
  private getSoundEffectVolume(baseVolume: number, isDropSound: boolean = false): number {
    const isMobile = this.isMobileDevice();
    if (!isMobile) return baseVolume;
    
    // Increase volume on mobile devices for better audibility
    // Drop sound gets extra boost (10x) while others get 3x
    const multiplier = isDropSound ? 10 : 3;
    return Math.min(1.0, baseVolume * multiplier);
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.context) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        this.context = new Ctx();
      }
    }
    return this.context;
  }

  // Call this on first user interaction to unlock audio on mobile
  async unlockAudio(): Promise<void> {
    const ctx = this.getContext();
    if (!ctx) return;

    // Always try to unlock on mobile, even if marked as unlocked
    // On mobile, the context can get suspended again
    const shouldUnlock = !this.isUnlocked || ctx.state === 'suspended';

    if (!shouldUnlock && ctx.state === 'running') {
      return; // Already unlocked and running
    }

    try {
      // On mobile, HTMLAudioElement is more reliable for unlocking than AudioContext
      // Create a silent audio element to unlock the audio system
      if (!this.unlockAudioElement) {
        // Create a data URI for a very short silent audio file
        const silentAudioData = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
        this.unlockAudioElement = new Audio(silentAudioData);
        this.unlockAudioElement.volume = 0.0001; // Almost silent
      }

      // Play the silent audio to unlock (this is what actually works on iOS/mobile)
      // This MUST happen in response to a user gesture
      try {
        // Reset audio element
        this.unlockAudioElement.currentTime = 0;
        await this.unlockAudioElement.play();
        // Immediately pause it after a tiny delay
        setTimeout(() => {
          this.unlockAudioElement?.pause();
          this.unlockAudioElement!.currentTime = 0;
        }, 10);
      } catch (e) {
        // If play fails, audio might need user gesture - that's okay, we'll try again
        console.warn('Audio element unlock attempt:', e);
      }

      // Also resume AudioContext if suspended
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      
      // Also play a very short oscillator sound to ensure AudioContext is active
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        gain.gain.value = 0.0001;
        osc.frequency.value = 20;
        osc.type = 'sine';
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.01);
      } catch (e) {
        // Oscillator might fail, but that's okay if Audio element worked
      }
      
      this.isUnlocked = true;
      console.log('Audio unlocked successfully, context state:', ctx.state);
    } catch (e) {
      // If unlock fails, we'll try again on next interaction
      console.warn('Failed to unlock audio:', e);
      this.isUnlocked = false;
    }
  }

  private async playOscillator(type: OscillatorType, startFreq: number, endFreq: number, duration: number, volume: number, isDropSound: boolean = false) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Try to resume context if suspended (don't wait for full unlock)
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
        this.isUnlocked = true;
      } catch (e) {
        // If resume fails, try to continue anyway - might work
        console.warn('Failed to resume audio context:', e);
      }
    }

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      if (startFreq !== endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
      }

      // Envelope for smooth click-free sound
      // Apply device-specific volume boost for mobile (extra boost for drop sound)
      const adjustedVolume = this.getSoundEffectVolume(volume, isDropSound);
      gain.gain.setValueAtTime(adjustedVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Silently fail if we can't play sound
      console.warn('Failed to play sound:', e);
    }
  }

  async playPickup() {
    // High pitched "bloop"
    // Try to unlock, but play sound even if unlock fails (might still work)
    this.unlockAudio().catch(() => {});
    // Don't await unlock - play immediately to catch user gesture
    this.playOscillator('sine', 500, 600, 0.1, 0.1).catch(() => {});
  }

  async playDrop() {
    // Low pitched "thud" or "wood" sound
    // Try to unlock, but play sound even if unlock fails (might still work)
    this.unlockAudio().catch(() => {});
    // Don't await unlock - play immediately to catch user gesture
    // Pass true to indicate this is the drop sound for extra mobile volume boost
    this.playOscillator('triangle', 150, 50, 0.1, 0.15, true).catch(() => {});
  }

  async playDelete() {
    // Descending "zap" or "crumple"
    // Try to unlock, but play sound even if unlock fails (might still work)
    this.unlockAudio().catch(() => {});
    // Don't await unlock - play immediately to catch user gesture
    this.playOscillator('sawtooth', 300, 50, 0.15, 0.08).catch(() => {});
  }

  async playSpawn() {
     // Pleasant chime
     // Try to unlock, but play sound even if unlock fails (might still work)
     this.unlockAudio().catch(() => {});
     // Don't await unlock - play immediately to catch user gesture
     this.playOscillator('sine', 880, 880, 0.15, 0.05).catch(() => {});
  }

  // Background music methods
  async initBackgroundMusic(musicUrl: string): Promise<void> {
    if (this.backgroundMusic) {
      return; // Already initialized
    }

    try {
      this.backgroundMusic = new Audio(musicUrl);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.getMusicVolume();
      this.backgroundMusic.preload = 'auto';
      
      // Handle errors
      this.backgroundMusic.addEventListener('error', (e) => {
        console.warn('Background music error:', e);
      });
    } catch (e) {
      console.warn('Failed to initialize background music:', e);
    }
  }

  async playBackgroundMusic(): Promise<void> {
    if (!this.backgroundMusic) {
      console.warn('Background music not initialized. Make sure the music file exists.');
      return;
    }
    if (this.isMusicPlaying) return;

    try {
      // Ensure audio is unlocked first
      await this.unlockAudio();
      
      // Set volume again before playing (important for mobile)
      this.backgroundMusic.volume = this.getMusicVolume();
      
      // Play the music
      await this.backgroundMusic.play();
      this.isMusicPlaying = true;
      console.log('Background music started');
    } catch (e) {
      console.warn('Failed to play background music:', e);
      // If play fails, it might be because audio isn't unlocked yet
      // The user will need to interact first
      this.isMusicPlaying = false;
    }
  }

  pauseBackgroundMusic(): void {
    if (!this.backgroundMusic) return;
    if (!this.isMusicPlaying) return;

    try {
      this.backgroundMusic.pause();
      this.isMusicPlaying = false;
    } catch (e) {
      console.warn('Failed to pause background music:', e);
    }
  }

  async toggleBackgroundMusic(): Promise<void> {
    if (this.isMusicPlaying) {
      this.pauseBackgroundMusic();
    } else {
      await this.playBackgroundMusic();
    }
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    if (this.backgroundMusic) {
      // Apply device-specific volume adjustment
      this.backgroundMusic.volume = this.getMusicVolume();
    }
  }

  getMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }
}

export const soundService = new SoundService();
