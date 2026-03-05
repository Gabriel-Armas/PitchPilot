export type NoteName =
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'E'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'A'
  | 'A#'
  | 'B'

export interface Note {
  name: NoteName
  octave: number
}

export const NOTES_IN_OCTAVE: NoteName[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

export function noteToFrequency(note: Note): number {
  const semitoneIndex = NOTES_IN_OCTAVE.indexOf(note.name)
  const a4Index = NOTES_IN_OCTAVE.indexOf('A') + 4 * 12
  const noteIndex = semitoneIndex + note.octave * 12
  const semitoneDiff = noteIndex - a4Index
  return 440 * Math.pow(2, semitoneDiff / 12)
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  return audioCtx
}

export function playOrganNote(note: Note, durationMs = 700): void {
  const ctx = getAudioContext()
  const now = ctx.currentTime
  const frequency = noteToFrequency(note)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(1.2, now + 0.02)
  gain.gain.linearRampToValueAtTime(0.9, now + 0.12)
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000)

  const harmonics = [1, 2, 3] as const

  harmonics.forEach((multiplier, index) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(frequency * multiplier, now)

    const partialGain = ctx.createGain()
    const level = index === 0 ? 1.1 : 0.6 / multiplier
    partialGain.gain.setValueAtTime(level, now)
    partialGain.gain.exponentialRampToValueAtTime(
      0.001,
      now + durationMs / 1000,
    )

    osc.connect(partialGain)
    partialGain.connect(gain)

    osc.start(now)
    osc.stop(now + durationMs / 1000)
  })

  gain.connect(ctx.destination)
}

export function getPianoNotesInOctave(octave: number): Note[] {
  return NOTES_IN_OCTAVE.map((name) => ({ name, octave }))
}

export function isBlackKey(name: NoteName): boolean {
  return name.includes('#')
}

