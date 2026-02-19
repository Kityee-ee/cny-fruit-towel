export class SoundService {
  private context: AudioContext | null = null;
  private isUnlocked: boolean = false;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private musicVolume: number = 0.3; // 30% volume for background music

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
    if (this.isUnlocked) return;
    
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      // Play a silent sound to unlock audio on iOS
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      this.isUnlocked = true;
    } catch (e) {
      console.warn('Failed to unlock audio:', e);
    }
  }

  private async playOscillator(type: OscillatorType, startFreq: number, endFreq: number, duration: number, volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Ensure context is running (browsers suspend it until user interaction)
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
        this.isUnlocked = true;
      } catch (e) {
        // If resume fails, audio is locked - silently fail
        return;
      }
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    if (startFreq !== endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    }

    // Envelope for smooth click-free sound
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playPickup() {
    // High pitched "bloop"
    this.playOscillator('sine', 500, 600, 0.1, 0.1).catch(() => {});
  }

  playDrop() {
    // Low pitched "thud" or "wood" sound
    this.playOscillator('triangle', 150, 50, 0.1, 0.15).catch(() => {});
  }

  playDelete() {
    // Descending "zap" or "crumple"
    this.playOscillator('sawtooth', 300, 50, 0.15, 0.08).catch(() => {});
  }

  playSpawn() {
     // Pleasant chime
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
      this.backgroundMusic.volume = this.musicVolume;
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
      this.backgroundMusic.volume = this.musicVolume;
    }
  }

  getMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }
}

export const soundService = new SoundService();
