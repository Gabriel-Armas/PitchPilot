import type { Note, NoteName } from './audio'
import { getPianoNotesInOctave, isBlackKey, playOrganNote } from './audio'
import './Piano.css'

const WHITE_ORDER: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const BLACK_CONFIGS: { name: NoteName; boundaryIndex: number }[] = [
  { name: 'C#', boundaryIndex: 1 }, // between C (0) and D (1)
  { name: 'D#', boundaryIndex: 2 }, // between D (1) and E (2)
  { name: 'F#', boundaryIndex: 4 }, // between F (3) and G (4)
  { name: 'G#', boundaryIndex: 5 }, // between G (4) and A (5)
  { name: 'A#', boundaryIndex: 6 }, // between A (5) and B (6)
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
  const whiteCount = WHITE_ORDER.length

  return (
    <div className="piano" aria-label="Piano keyboard">
      <div className="piano-white-keys">
        {WHITE_ORDER.map((name) => {
          const note = whiteNotes.find((n) => n.name === name)
          if (!note) return null
          return (
            <button
              key={`${note.name}${note.octave}`}
              type="button"
              className="piano-key white"
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

      <div className="piano-black-keys">
        {BLACK_CONFIGS.map(({ name, boundaryIndex }) => {
          const note = notes.find((n) => n.name === name)
          if (!note) return null
          const leftPercent = (boundaryIndex / whiteCount) * 100

          return (
            <button
              key={`${note.name}${note.octave}`}
              type="button"
              className="piano-key black"
              style={{ left: `${leftPercent}%` }}
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

