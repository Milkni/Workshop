/**
 * Play a high-quality synth chime entirely client-side using the Web Audio API.
 * This guarantees audio alerts work offline and do not rely on external MP3 resources.
 */
export function playWorkshopChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Create primary oscillator
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Sweet xylophone / chime sound using a sine wave with fast attack & exponential decay
    osc.type = 'sine';
    
    const now = ctx.currentTime;
    // Play a friendly C5 to G5 chime
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
    
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.start(now);
    osc.stop(now + 0.7);
  } catch (error) {
    console.warn('AudioContext is not allowed or supported on this browser context', error);
  }
}
