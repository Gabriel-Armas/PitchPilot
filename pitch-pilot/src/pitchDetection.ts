import { NOTES_IN_OCTAVE } from './audio'

export interface PitchInfo {
  frequency: number
  noteName: string
  octave: number
  cents: number
}

const A4 = 440

export function frequencyToNote(frequency: number): PitchInfo {
  const midi = 69 + 12 * Math.log2(frequency / A4)
  const rounded = Math.round(midi)
  const cents = (midi - rounded) * 100

  const noteIndex = ((rounded % 12) + 12) % 12
  const octave = Math.floor(rounded / 12) - 1
  const noteName = NOTES_IN_OCTAVE[noteIndex]

  return {
    frequency,
    noteName,
    octave,
    cents,
  }
}

export async function getMicStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: false,
    },
  })
}

export type PitchCallback = (info: PitchInfo | null) => void

export function startPitchDetection(
  stream: MediaStream,
  callback: PitchCallback,
): () => void {
  const audioCtx = new (window.AudioContext ||
    (window as any).webkitAudioContext)()
  const source = audioCtx.createMediaStreamSource(stream)

  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 2048
  const bufferLength = analyser.fftSize
  const buffer = new Float32Array(bufferLength)

  source.connect(analyser)

  let stopped = false

  const detectPitch = () => {
    if (stopped) return

    analyser.getFloatTimeDomainData(buffer)
    const frequency = autoCorrelate(buffer, audioCtx.sampleRate)

    if (frequency !== null && !Number.isNaN(frequency)) {
      callback(frequencyToNote(frequency))
    } else {
      callback(null)
    }

    requestAnimationFrame(detectPitch)
  }

  detectPitch()

  return () => {
    stopped = true
    source.disconnect()
    audioCtx.close()
    stream.getTracks().forEach((t) => t.stop())
  }
}

function autoCorrelate(
  buffer: Float32Array,
  sampleRate: number,
): number | null {
  const SIZE = buffer.length
  let rms = 0

  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i]
    rms += val * val
  }
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.01) return null

  let r1 = 0
  let r2 = SIZE - 1
  const threshold = 0.2
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i
      break
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i
      break
    }
  }

  const trimmed = buffer.slice(r1, r2)
  const trimmedSize = trimmed.length

  const c = new Array<number>(trimmedSize).fill(0)

  for (let i = 0; i < trimmedSize; i++) {
    for (let j = 0; j < trimmedSize - i; j++) {
      c[i] = c[i] + trimmed[j] * trimmed[j + i]
    }
  }

  let d = 0
  while (d < trimmedSize - 1 && c[d] > c[d + 1]) {
    d++
  }

  let max = -1
  let maxIndex = -1
  for (let i = d; i < trimmedSize; i++) {
    if (c[i] > max) {
      max = c[i]
      maxIndex = i
    }
  }

  if (maxIndex <= 0) return null

  const T0 = maxIndex
  return sampleRate / T0
}


