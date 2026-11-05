'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Record_ } from '~/lib/personal'
import { playMechanicalSound } from '~/lib/sound'

interface BraunVinylTurntableProps {
  record: Record_
}

/**
 * Procedural Lo-fi / Vinyl Soundscape Synthesizer
 * Generates warm ambient chords and subtle authentic vinyl surface crackle
 * using pure native Web Audio API (zero external asset dependency).
 */
class ProceduralVinylAudio {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private crackleNode: AudioNode | null = null
  private chordInterval: NodeJS.Timeout | null = null
  private isRunning = false

  public init(volume = 0.5) {
    if (typeof window === 'undefined') return
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) return
      if (!this.ctx) {
        this.ctx = new AudioCtx()
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }

      if (!this.masterGain && this.ctx) {
        this.masterGain = this.ctx.createGain()
        this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime)
        this.masterGain.connect(this.ctx.destination)
      }
    } catch {
      // AudioContext policy safe
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime, 0.05)
    }
  }

  public start(mood: string) {
    if (!this.ctx || !this.masterGain) this.init()
    if (!this.ctx || !this.masterGain || this.isRunning) return
    this.isRunning = true

    try {
      // 1. Vinyl Surface Noise (Dust & gentle micro-crackle)
      const bufferSize = this.ctx.sampleRate * 2
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        // Pink noise with occasional dust pop spikes
        const isDust = Math.random() < 0.0008
        output[i] = isDust ? (Math.random() * 2 - 1) * 0.4 : (Math.random() * 2 - 1) * 0.015
      }

      const whiteNoise = this.ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      // Filter: warm bandpass simulating vinyl needle friction
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 850
      filter.Q.value = 1.2

      const noiseGain = this.ctx.createGain()
      noiseGain.gain.setValueAtTime(0.06, this.ctx.currentTime)

      whiteNoise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(this.masterGain)
      whiteNoise.start()
      this.crackleNode = whiteNoise

      // 2. Ambient Harmonic Arpeggiated Chords (Lo-fi electric piano warmth)
      // Base frequencies tuned by mood
      const scales: Record<string, number[]> = {
        '学习时听': [220, 261.63, 329.63, 392.0, 440], // A minor pentatonic (Sakamoto feel)
        '放松时听': [196, 246.94, 293.66, 369.99, 440], // G major 7 (serene folk)
        '开心时听': [261.63, 329.63, 392.0, 523.25, 587.33], // C major bright
      }
      const chordNotes = scales[mood] || scales['学习时听']

      let noteIdx = 0
      const playNextTone = () => {
        if (!this.isRunning || !this.ctx || !this.masterGain) return
        try {
          const now = this.ctx.currentTime
          const freq = chordNotes[noteIdx % chordNotes.length]
          noteIdx++

          const osc = this.ctx.createOscillator()
          const oscFilter = this.ctx.createBiquadFilter()
          const toneGain = this.ctx.createGain()

          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, now)

          oscFilter.type = 'lowpass'
          oscFilter.frequency.setValueAtTime(450, now)
          oscFilter.frequency.exponentialRampToValueAtTime(120, now + 2.8)

          toneGain.gain.setValueAtTime(0.001, now)
          toneGain.gain.linearRampToValueAtTime(0.08, now + 0.15)
          toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2)

          osc.connect(oscFilter)
          oscFilter.connect(toneGain)
          toneGain.connect(this.masterGain)

          osc.start(now)
          osc.stop(now + 3.3)
        } catch {
          // ignore
        }
      }

      playNextTone()
      this.chordInterval = setInterval(playNextTone, 2400)
    } catch {
      // safe fallback
    }
  }

  public stop() {
    this.isRunning = false
    if (this.chordInterval) {
      clearInterval(this.chordInterval)
      this.chordInterval = null
    }
    if (this.crackleNode) {
      try {
        ;(this.crackleNode as AudioBufferSourceNode).stop()
        this.crackleNode.disconnect()
      } catch {
        // ignore
      }
      this.crackleNode = null
    }
  }
}

export function BraunVinylTurntable({ record }: BraunVinylTurntableProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [rpm, setRpm] = useState<'33' | '45'>('33')
  const [volume, setVolume] = useState(0.7)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [tonearmAngle, setTonearmAngle] = useState(0) // 0deg (rest) -> 24deg (outer rim) -> 33deg (inner rim)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<ProceduralVinylAudio | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize procedural audio synth on mount
  useEffect(() => {
    synthRef.current = new ProceduralVinylAudio()
    return () => {
      synthRef.current?.stop()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Handle switching albums while playing
  useEffect(() => {
    if (isPlaying) {
      playMechanicalSound('click')
      // If procedural synth is active, retune mood
      synthRef.current?.stop()
      synthRef.current?.start(record.mood)
      setPlaybackTime(0)
      setTonearmAngle(24)
    }
  }, [record.album, record.artist, record.mood, isPlaying])

  // Handle playback timer & tonearm slow inwards advancement
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setPlaybackTime((prev) => {
          const next = prev + 1
          // Advance tonearm from 24deg to 33deg over 180 seconds
          const angle = Math.min(33, 24 + (next / 180) * 9)
          setTonearmAngle(angle)
          return next
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying])

  const togglePlay = () => {
    playMechanicalSound('shutter')
    if (isPlaying) {
      // Pause
      setIsPlaying(false)
      setTonearmAngle(0) // smoothly return arm to rest
      if (audioRef.current && record.audioSrc) {
        audioRef.current.pause()
      }
      synthRef.current?.stop()
    } else {
      // Play
      setIsPlaying(true)
      setTonearmAngle(24) // smoothly drop needle
      if (record.audioSrc && audioRef.current) {
        audioRef.current.volume = volume
        audioRef.current.play().catch(() => {
          // fallback to procedural synth
          synthRef.current?.start(record.mood)
        })
      } else {
        synthRef.current?.start(record.mood)
      }
    }
  }

  const handleRpmToggle = (targetRpm: '33' | '45') => {
    playMechanicalSound('click')
    setRpm(targetRpm)
    if (audioRef.current && record.audioSrc) {
      audioRef.current.playbackRate = targetRpm === '45' ? 1.35 : 1.0
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
    }
    synthRef.current?.setVolume(val)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const spinDuration = rpm === '45' ? '1.33s' : '1.8s'

  return (
    <div
      className="braun-turntable-chassis mt-6 p-4 sm:p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm relative overflow-hidden transition-all duration-300"
      aria-label={`Braun Hi-Fi Vinyl Turntable playing ${record.album}`}
    >
      {/* 1. Header Bar: Braun Technical Dieter Rams Wordmark & Status */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)] text-[10px] font-mono tracking-widest uppercase opacity-75">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-[var(--foreground)]">BRAUN AUDIO 310</span>
          <span className="opacity-40">|</span>
          <span className="hidden sm:inline">HIGH FIDELITY PHONOGRAPH</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-[var(--border)]'
              }`}
            />
            <span>{isPlaying ? 'ACTIVE STEREO' : 'STANDBY'}</span>
          </span>
          <span className="opacity-40">|</span>
          {/* RPM Buttons */}
          <div className="inline-flex rounded border border-[var(--border)] p-0.5 bg-[var(--background)]">
            <button
              type="button"
              onClick={() => handleRpmToggle('33')}
              className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
                rpm === '33'
                  ? 'bg-[var(--foreground)] text-[var(--background)] font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              33 ⅓
            </button>
            <button
              type="button"
              onClick={() => handleRpmToggle('45')}
              className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
                rpm === '45'
                  ? 'bg-[var(--foreground)] text-[var(--background)] font-bold'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              45
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Mechanical Deck: Turntable Platter (Left) & Tonearm/Controls (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Left / Center: Turntable Platter & Vinyl Disc (7 cols on md) */}
        <div className="md:col-span-7 flex justify-center relative py-2">
          {/* Turntable Platter Well (Machined aluminum recessed bed) */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 bg-neutral-900 border-2 border-neutral-700/60 shadow-[inset_0_4px_16px_rgba(0,0,0,0.8)] flex items-center justify-center">
            {/* Outer Strobe Dots Ring (Frequency sync measurement dots) */}
            <div
              className="absolute inset-1 rounded-full pointer-events-none opacity-40 border border-dashed border-neutral-500"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #555 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />

            {/* Rotating Vinyl Disc */}
            <div
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-2xl transition-transform"
              style={{
                animation: isPlaying ? `spin ${spinDuration} linear infinite` : 'none',
                background:
                  'radial-gradient(circle, #1a1a1a 0%, #111111 50%, #0d0d0d 85%, #181818 100%)',
              }}
            >
              {/* Concentric Sound Grooves Texture */}
              <div
                className="absolute inset-0 rounded-full opacity-35"
                style={{
                  backgroundImage:
                    'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, rgba(255,255,255,0.06) 3px, transparent 4px)',
                }}
              />

              {/* Anisotropic Groove Light Reflections (Two opposing light cones) */}
              <div
                className="absolute inset-0 rounded-full opacity-25 pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.2) 45deg, transparent 90deg, transparent 180deg, rgba(255,255,255,0.2) 225deg, transparent 270deg)',
                }}
              />

              {/* Center Album Artwork Label */}
              <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-neutral-800 shadow-md overflow-hidden bg-neutral-900 flex items-center justify-center">
                <Image
                  src={record.cover || record.art}
                  alt={record.album}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
                {/* Center Spindle Hole */}
                <div className="absolute w-3 h-3 rounded-full bg-neutral-900 border border-neutral-400 shadow-inner z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Right / Controls: Tonearm Graphic & Precision Deck Controls (5 cols on md) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          {/* Tonearm Visual Indicator */}
          <div className="relative h-20 bg-[var(--background)] border border-[var(--border)] rounded-xl p-3 flex items-center justify-between overflow-hidden">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase">
                TONEARM MECHANISM
              </span>
              <p className="text-xs font-semibold text-[var(--foreground)]">
                {isPlaying ? 'Stylus Engaged · 1.5g Downforce' : 'Stylus Parked on Rest'}
              </p>
            </div>

            {/* Tonearm SVG Graphic */}
            <div className="relative w-20 h-16 flex items-center justify-center">
              <svg
                width="72"
                height="56"
                viewBox="0 0 72 56"
                className="transition-transform duration-700 ease-out"
                style={{
                  transformOrigin: '58px 12px',
                  transform: `rotate(${tonearmAngle}deg)`,
                }}
              >
                {/* Pivot Base */}
                <circle cx="58" cy="12" r="8" fill="#4B5563" stroke="#9CA3AF" strokeWidth="1.5" />
                <circle cx="58" cy="12" r="3" fill="#D1D5DB" />
                {/* Counterweight rear */}
                <rect x="54" y="2" width="8" height="6" rx="1" fill="#374151" />
                {/* Tonearm Tube */}
                <line x1="58" y1="12" x2="20" y2="40" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
                {/* Cartridge Headshell */}
                <path d="M 20 40 L 12 45 L 14 50 L 22 44 Z" fill="#D97706" stroke="#B45309" strokeWidth="1" />
                {/* Stylus Needle */}
                <line x1="13" y1="48" x2="11" y2="52" stroke="#FFFFFF" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Currently Selected Record Information */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--border)] text-[var(--signal)]">
                {record.mood}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                {record.year} · {record.genre}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[var(--foreground)] truncate">
              {record.album}
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] truncate">
              {record.artist}
            </p>
          </div>

          {/* Main Action Bar: Big Play/Pause Push Button & Progress Line */}
          <div className="pt-2 border-t border-[var(--border)] space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className={`flex-1 py-2 px-4 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isPlaying
                    ? 'bg-[var(--signal)] text-white shadow-md shadow-[var(--signal)]/20'
                    : 'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90'
                }`}
              >
                {isPlaying ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    <span>PAUSE ROTATION</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>LOWER NEEDLE & PLAY</span>
                  </>
                )}
              </button>
            </div>

            {/* Time progress & Volume slider */}
            <div className="flex items-center justify-between gap-3 text-[11px] font-mono text-[var(--muted-foreground)]">
              <span>{formatTime(playbackTime)}</span>
              <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--signal)] transition-all duration-300"
                  style={{ width: `${Math.min(100, (playbackTime / 180) * 100)}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-14 h-1 accent-[var(--signal)] cursor-pointer"
                  aria-label="Volume slider"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional native HTML5 Audio element if audioSrc is provided in record */}
      {record.audioSrc && (
        <audio
          ref={audioRef}
          src={record.audioSrc}
          preload="none"
          onEnded={() => {
            setIsPlaying(false)
            setTonearmAngle(0)
          }}
        />
      )}
    </div>
  )
}
