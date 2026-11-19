/**
 * Synthesizes the exact 38 ms ASMR mechanical tactile click waveform matching
 * UCE.App.UI.Services.Recording.AsmrClickSoundPlayer from the Resus desktop app.
 *
 * Algorithm breakdown:
 * 1. Soft cosine attack (0.25 ms) & smooth cosine fade-out (last 6 ms)
 * 2. Warm tactile thock body swept 340 Hz -> 145 Hz
 * 3. Crisp mechanical snap transient (~2650 Hz + filtered xorshift32 PRNG burst)
 * 4. Subtle mouse-shell / keycap resonance (~1180 Hz)
 * 5. Normalized gain peak: 0.72f
 */

let cachedBuffer: AudioBuffer | null = null;
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx) {
    sharedCtx = new AudioCtx();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

function getOrGenerateAsmrBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedBuffer && cachedBuffer.sampleRate === ctx.sampleRate) {
    return cachedBuffer;
  }

  const sampleRate = ctx.sampleRate;
  const durationMs = 38;
  const frames = Math.floor((sampleRate * durationMs) / 1000);
  const buffer = ctx.createBuffer(1, frames, sampleRate);
  const channelData = buffer.getChannelData(0);

  const attackSec = 0.00025;
  const fadeOutStartSec = 0.032;
  const totalSec = durationMs / 1000.0;

  let phaseBody = 0.0;
  let maxAbs = 0.0;

  // Deterministic xorshift32 PRNG seed matching AsmrClickSoundPlayer.cs (0x5A17C0DE)
  let rng = 0x5a17c0de;

  for (let i = 0; i < frames; i++) {
    const t = i / sampleRate;

    // 1. Soft cosine attack (0.25 ms) & smooth tail fade-out (last 6 ms)
    let envWindow = 1.0;
    if (t < attackSec) {
      envWindow = 0.5 * (1.0 - Math.cos((Math.PI * t) / attackSec));
    } else if (t > fadeOutStartSec) {
      const u = Math.min(Math.max((t - fadeOutStartSec) / (totalSec - fadeOutStartSec), 0.0), 1.0);
      envWindow = 0.5 * (1.0 + Math.cos(Math.PI * u));
    }

    // 2. Warm tactile thock body (swept 340 Hz -> 145 Hz)
    const freqBody = 145.0 + 195.0 * Math.exp(-t / 0.0045);
    phaseBody += (2.0 * Math.PI * freqBody) / sampleRate;
    const body = Math.sin(phaseBody) * Math.exp(-t / 0.0058) * 0.65;

    // 3. Crisp switch snap transient (~2650 Hz + subtle filtered noise burst)
    rng ^= rng << 13;
    rng ^= rng >>> 17;
    rng ^= rng << 5;
    const white = ((rng & 0xffff) / 32768.0) - 1.0;
    const snapTone = Math.sin(2.0 * Math.PI * 2650.0 * t);
    const snap = (snapTone * 0.65 + white * 0.35) * Math.exp(-t / 0.0013) * 0.55;

    // 4. Subtle keycap / mouse-shell resonance (~1180 Hz)
    const shell = Math.sin(2.0 * Math.PI * 1180.0 * t) * Math.exp(-t / 0.003) * 0.22;

    const sample = (body + snap + shell) * envWindow;
    channelData[i] = sample;
    const abs = Math.abs(sample);
    if (abs > maxAbs) {
      maxAbs = abs;
    }
  }

  // Normalize gain to 0.72f matching AsmrClickSoundPlayer.cs
  const gain = maxAbs > 1e-5 ? 0.72 / maxAbs : 1.0;
  for (let i = 0; i < frames; i++) {
    channelData[i] *= gain;
  }

  cachedBuffer = buffer;
  return buffer;
}

/**
 * Plays the exact Resus ASMR mechanical switch tactile click sound.
 */
export function playResusAsmrClick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const buffer = getOrGenerateAsmrBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  } catch {
    // AudioContext blocked or not allowed yet by user interaction
  }
}
