import './App.css'
import { useCallback, useEffect, useState } from 'react'
import { Piano } from './Piano'
import { Tuner } from './Tuner'
import type { Note } from './audio'
import { NOTES_IN_OCTAVE, playOrganNote } from './audio'

function App() {
  const [octave, setOctave] = useState(4)
  const [lastNote, setLastNote] = useState<Note | null>(null)
  const [targetNote, setTargetNote] = useState<Note | null>(null)

  const clampOctave = (value: number) => Math.min(6, Math.max(2, value))

  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      if (!event.altKey) return
      const key = event.key.toLowerCase()

      if (key >= '2' && key <= '6') {
        setOctave(clampOctave(Number(key)))
        return
      }

      const map: Record<string, number> = {
        a: 0,
        w: 1,
        s: 2,
        e: 3,
        d: 4,
        f: 5,
        t: 6,
        g: 7,
        y: 8,
        h: 9,
        u: 10,
        j: 11,
      }

      if (!(key in map)) return

      event.preventDefault()
      const index = map[key]
      const name = NOTES_IN_OCTAVE[index]
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
              <code>Alt + A W S E D F T G Y H U J</code> for notes in the
              current octave. Press <code>Alt + 2–6</code> to change octave.
            </p>
            <p>
              Example: to approximate your idea for C♯4, press{' '}
              <code>Alt + W</code> when octave is 4.
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
