import type { Note, NoteName } from './audio'
import { getPianoNotesInOctave, isBlackKey, playOrganNote } from './audio'
import './Piano.css'

const DISPLAY_ORDER: NoteName[] = [
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

export interface PianoProps {
  octave: number
  onNotePlayed?: (note: Note) => void
}

export function Piano({ octave, onNotePlayed }: PianoProps) {
  const notes = getPianoNotesInOctave(octave)

  const handlePlay = (note: Note) => {
    playOrganNote(note)
    onNotePlayed?.(note)
  }

  const whiteNotes = notes.filter((n) => !isBlackKey(n.name))
  const blackNotes = notes.filter((n) => isBlackKey(n.name))

  return (
    <div className="piano" aria-label="Piano keyboard">
      <div className="piano-white-keys">
        {whiteNotes.map((note) => (
          <button
            key={`${note.name}${note.octave}`}
            className="piano-key white"
            onClick={() => handlePlay(note)}
          >
            <span className="piano-key-label">
              {note.name}
              {note.octave}
            </span>
          </button>
        ))}
      </div>
      <div className="piano-black-keys">
        {DISPLAY_ORDER.map((name) => {
          if (!name.includes('#')) return null
          const note = blackNotes.find((n) => n.name === name)
          if (!note) return null
          return (
            <button
              key={`${note.name}${note.octave}`}
              className={`piano-key black piano-key-${note.name.replace(
                '#',
                's',
              )}`}
              onClick={() => handlePlay(note)}
            >
              <span className="piano-key-label">
                {note.name}
                {note.octave}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

