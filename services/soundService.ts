export class SoundService {
  private context: AudioContext | null = null;
  private isUnlocked: boolean = false;

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
}

export const soundService = new SoundService();
