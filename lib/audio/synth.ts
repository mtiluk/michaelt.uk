const PEAK = 0.0001;
const ATTACK = 0.004;

let context: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

function envelope(gain: GainNode, at: number, peak: number, dur: number) {
  gain.gain.setValueAtTime(PEAK, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + ATTACK);
  gain.gain.exponentialRampToValueAtTime(PEAK, at + ATTACK + dur);
}

type ToneOptions = {
  freq: number;
  slideTo?: number;
  at?: number;
  dur?: number;
  gain?: number;
  type?: OscillatorType;
};

function tone(ctx: AudioContext, start: number, detune: number, options: ToneOptions) {
  const { freq, slideTo, at = 0, dur = 0.08, gain = 0.06, type = "sine" } = options;
  const begin = start + at;
  const osc = ctx.createOscillator();
  const level = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq * detune, begin);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo * detune, begin + dur);

  envelope(level, begin, gain, dur);
  osc.connect(level).connect(ctx.destination);
  osc.start(begin);
  osc.stop(begin + dur + ATTACK + 0.03);
}

function noise(ctx: AudioContext, start: number, options: { at?: number; dur?: number; gain?: number; cutoff?: number }) {
  const { at = 0, dur = 0.03, gain = 0.05, cutoff = 1200 } = options;
  const begin = start + at;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i += 1) {
    samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
  }

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const level = ctx.createGain();

  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = cutoff;

  envelope(level, begin, gain, dur);
  source.connect(filter).connect(level).connect(ctx.destination);
  source.start(begin);
}

const SOUNDS = {
  hover: (ctx: AudioContext, t: number, d: number) => {
    tone(ctx, t, d, { freq: 660, dur: 0.05, gain: 0.025 });
    tone(ctx, t, d, { freq: 880, at: 0.03, dur: 0.06, gain: 0.018 });
  },
  tap: (ctx: AudioContext, t: number, d: number) => {
    noise(ctx, t, { dur: 0.028, gain: 0.045, cutoff: 1100 });
    tone(ctx, t, d, { freq: 170, dur: 0.05, gain: 0.05, type: "triangle" });
  },
  keyPress: (ctx: AudioContext, t: number, d: number) => {
    noise(ctx, t, { dur: 0.012, gain: 0.02, cutoff: 2400 });
    tone(ctx, t, d, { freq: 980, dur: 0.02, gain: 0.012 });
  },
  select: (ctx: AudioContext, t: number, d: number) => {
    tone(ctx, t, d, { freq: 560, dur: 0.06, gain: 0.045 });
    tone(ctx, t, d, { freq: 760, at: 0.04, dur: 0.07, gain: 0.035 });
  },
  toggle: (ctx: AudioContext, t: number, d: number) => {
    noise(ctx, t, { dur: 0.018, gain: 0.025, cutoff: 1600 });
    tone(ctx, t, d, { freq: 520, slideTo: 700, dur: 0.07, gain: 0.04, type: "triangle" });
  },
  expand: (ctx: AudioContext, t: number, d: number) => {
    tone(ctx, t, d, { freq: 380, slideTo: 620, dur: 0.11, gain: 0.035, type: "triangle" });
  },
  collapse: (ctx: AudioContext, t: number, d: number) => {
    tone(ctx, t, d, { freq: 620, slideTo: 380, dur: 0.11, gain: 0.035, type: "triangle" });
  },
  send: (ctx: AudioContext, t: number, d: number) => {
    tone(ctx, t, d, { freq: 480, slideTo: 980, dur: 0.13, gain: 0.04 });
  },
  success: (ctx: AudioContext, t: number, d: number) => {
    tone(ctx, t, d, { freq: 523, dur: 0.11, gain: 0.05 });
    tone(ctx, t, d, { freq: 784, at: 0.08, dur: 0.13, gain: 0.04 });
    tone(ctx, t, d, { freq: 1046, at: 0.16, dur: 0.18, gain: 0.03 });
  },
  error: (ctx: AudioContext, t: number, d: number) => {
    tone(ctx, t, d, { freq: 320, slideTo: 180, dur: 0.18, gain: 0.05, type: "triangle" });
  },
} as const;

export type SoundName = keyof typeof SOUNDS;

export function play(name: SoundName) {
  const ctx = audio();
  if (!ctx) return;
  SOUNDS[name](ctx, ctx.currentTime + 0.005, 0.94 + Math.random() * 0.12);
}
