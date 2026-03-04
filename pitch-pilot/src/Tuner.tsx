import { useEffect, useState } from 'react'
import type { PitchInfo } from './pitchDetection'
import { getMicStream, startPitchDetection } from './pitchDetection'
import './Tuner.css'

export function Tuner() {
  const [active, setActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pitch, setPitch] = useState<PitchInfo | null>(null)

  useEffect(() => {
    if (!active) return

    let stopDetection: (() => void) | null = null

    getMicStream()
      .then((stream) => {
        stopDetection = startPitchDetection(stream, (info) => {
          setPitch(info)
        })
      })
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? e.message
            : 'Could not access microphone. Check permissions.',
        )
        setActive(false)
      })

    return () => {
      stopDetection?.()
      setPitch(null)
    }
  }, [active])

  const cents = pitch?.cents ?? 0
  const clampedCents = Math.max(-50, Math.min(50, cents))
  const needlePosition = (clampedCents / 50) * 50

  return (
    <div className="tuner">
      <div className="tuner-header">
        <button
          type="button"
          className={`tuner-toggle ${active ? 'on' : 'off'}`}
          onClick={() => {
            setError(null)
            setActive((v) => !v)
          }}
        >
          {active ? 'Stop tuner' : 'Start tuner'}
        </button>
        {error && <p className="tuner-error">{error}</p>}
      </div>

      <div className="tuner-main">
        <div className="tuner-note">
          {pitch ? (
            <>
              <span className="tuner-note-name">{pitch.noteName}</span>
              <span className="tuner-note-octave">{pitch.octave}</span>
              <span className="tuner-frequency">
                {pitch.frequency.toFixed(1)} Hz
              </span>
            </>
          ) : (
            <span className="tuner-placeholder">
              Sing a steady note near the piano&apos;s pitch.
            </span>
          )}
        </div>

        <div className="tuner-meter">
          <div className="tuner-scale">
            <span>-50</span>
            <span>0</span>
            <span>+50</span>
          </div>
          <div className="tuner-needle-track">
            <div
              className="tuner-needle"
              style={{ transform: `translateX(${needlePosition}%)` }}
            />
            <div className="tuner-center-line" />
          </div>
          <div className="tuner-cents">
            {pitch ? `${cents.toFixed(1)} cents` : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

