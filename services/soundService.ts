export class SoundService {
  private context: AudioContext | null = null;

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

  private playOscillator(type: OscillatorType, startFreq: number, endFreq: number, duration: number, volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Ensure context is running (browsers suspend it until user interaction)
    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
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
    this.playOscillator('sine', 500, 600, 0.1, 0.1);
  }

  playDrop() {
    // Low pitched "thud" or "wood" sound
    this.playOscillator('triangle', 150, 50, 0.1, 0.15);
  }

  playDelete() {
    // Descending "zap" or "crumple"
    this.playOscillator('sawtooth', 300, 50, 0.15, 0.08);
  }

  playSpawn() {
     // Pleasant chime
     this.playOscillator('sine', 880, 880, 0.15, 0.05);
  }
}

export const soundService = new SoundService();
