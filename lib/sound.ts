// Web Audio mechanical sound synthesis & toggle state for personal brand site
// Zero external package dependency; pure native Web Audio API with SSR safety.

let inMemorySoundEnabled = true
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null
    if (!audioCtx) {
      audioCtx = new AudioContextClass()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

export function soundEnabled(): boolean {
  if (typeof window === 'undefined') return inMemorySoundEnabled
  try {
    const preference = localStorage.getItem('sound')
    return preference === null ? inMemorySoundEnabled : preference === 'on'
  } catch {
    return inMemorySoundEnabled
  }
}

export const isSoundEnabled = soundEnabled

export function setSoundEnabled(on: boolean): void {
  inMemorySoundEnabled = on
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('sound', on ? 'on' : 'off')
  } catch {
    // ignore in restricted private browsing
  }
}

export function toggleSound(): boolean {
  const next = !soundEnabled()
  setSoundEnabled(next)
  if (next) {
    playMechanicalSound('click')
  }
  return next
}

export type MechanicalSoundCue = 'shutter' | 'click' | 'chime' | 'success'

/**
 * Synthesizes mechanical camera shutter, subtle tactile clicks, or chimes
 * using pure Web Audio oscillator and noise envelopes.
 */
export function playMechanicalSound(cue: MechanicalSoundCue = 'click'): void {
  if (!soundEnabled()) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime

    if (cue === 'click') {
      // Crisp mechanical micro-click (35ms duration)
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.035)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.035)
    } else if (cue === 'shutter') {
      // Dual-action mechanical camera shutter (curtain 1 + curtain 2)
      // Pulse 1: mirror lift
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'square'
      osc1.frequency.setValueAtTime(900, now)
      osc1.frequency.exponentialRampToValueAtTime(150, now + 0.025)
      gain1.gain.setValueAtTime(0.09, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.025)

      // Pulse 2: shutter blade closes (35ms later)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(1600, now + 0.035)
      osc2.frequency.exponentialRampToValueAtTime(400, now + 0.075)
      gain2.gain.setValueAtTime(0.07, now + 0.035)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.075)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.035)
      osc2.stop(now + 0.075)
    } else if (cue === 'chime' || cue === 'success') {
      // Soft gentle glass chime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now) // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.15)
    }
  } catch {
    // Audio synthesis failure should never break UI
  }
}

export function playDockSound(_cue?: string): void {
  playMechanicalSound('click')
}

export function playPreferenceSound(): void {
  playMechanicalSound('chime')
}

export function playShutterSound(): void {
  playMechanicalSound('shutter')
}

export function playCoverSound(on: boolean): void {
  playMechanicalSound(on ? 'chime' : 'click')
}

