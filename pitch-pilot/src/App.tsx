import './App.css'
import { useCallback, useEffect, useState } from 'react'
import { Piano } from './Piano'
import { Tuner } from './Tuner'
import type { Note, NoteName } from './audio'
import { playOrganNote } from './audio'

function App() {
  const [octave, setOctave] = useState(4)
  const [lastNote, setLastNote] = useState<Note | null>(null)
  const [targetNote, setTargetNote] = useState<Note | null>(null)

  const clampOctave = (value: number) => Math.min(6, Math.max(2, value))

  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (event.altKey && key >= '2' && key <= '6') {
        setOctave(clampOctave(Number(key)))
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return

      const naturalMap: Record<string, NoteName> = {
        c: 'C',
        d: 'D',
        e: 'E',
        f: 'F',
        g: 'G',
        a: 'A',
        b: 'B',
      }

      // sharps with Shift + letter (where a sharp exists)
      if (event.shiftKey) {
        const sharpFromLetter: Partial<Record<string, NoteName>> = {
          c: 'C#',
          d: 'D#',
          f: 'F#',
          g: 'G#',
          a: 'A#',
        }
        const sharpName = sharpFromLetter[key]
        if (!sharpName) return

        event.preventDefault()
        const note: Note = { name: sharpName, octave }
        playOrganNote(note)
        setLastNote(note)
        return
      }

      const name = naturalMap[key]
      if (!name) return

      event.preventDefault()
      const note: Note = { name, octave }
      playOrganNote(note)
      setLastNote(note)
    },
    [octave],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [handleKeyboard])

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Pitch Pilot</h1>
        <p className="app-subtitle">
          Train your ear and voice by matching piano notes.
        </p>
      </header>

      <main>
        <section className="app-panel">
          <div className="app-panel-header">
            <h2>Piano</h2>
            <div className="octave-controls">
              <button
                type="button"
                onClick={() => setOctave((o) => clampOctave(o - 1))}
              >
                −
              </button>
              <span>
                Octave <strong>{octave}</strong>
              </span>
              <button
                type="button"
                onClick={() => setOctave((o) => clampOctave(o + 1))}
              >
                +
              </button>
            </div>
          </div>

          <Piano
            octave={octave}
            onNotePlayed={(note) => {
              setLastNote(note)
              setTargetNote(note)
            }}
          />

          <div className="hint">
            <p>
              <strong>Keyboard control</strong>:{' '}
              white keys with <code>C D E F G A B</code> and sharps with{' '}
              <code>Shift + C / D / F / G / A</code> in the current octave.
              Press <code>Alt + 2–6</code> to change octave.
            </p>
            <p>
              Example: C4 = <code>C</code>, C♯4 = <code>Shift + C</code>, D4 ={' '}
              <code>D</code>, D♯4 = <code>Shift + D</code>, etc.
            </p>
          </div>
        </section>

        <section className="app-panel">
          <h2>Voice tuner</h2>
          {targetNote && (
            <p className="hint">
              Try to match:{' '}
              <strong>
                {targetNote.name}
                {targetNote.octave}
              </strong>
              . Sing and watch the tuner needle approach center.
            </p>
          )}
          <Tuner />
        </section>

        <section className="app-panel">
          <h2>Last played note</h2>
          {lastNote ? (
            <p className="last-note">
              {lastNote.name}
              {lastNote.octave}
            </p>
          ) : (
            <p>Play a note to see it here.</p>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
