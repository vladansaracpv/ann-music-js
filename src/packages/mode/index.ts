import { rotate } from '@base/arrays';
import { Note, NOTE } from '@packages/note';
import { chordFormula, chord } from '@packages/chord';
import { scale } from '@packages/scale';
import { MODES, IONIAN_CHORDS, IONIAN_STEPS, MODES_CHORDS, MODES_STEPS } from './theory';
export * from './dictionary';

const midiToNote = (midi: number) => Note({ midi: midi }).name;

const transposeFormula = (formula: number[], octave: number) => formula.map(t => t + 12 * octave);

export function chordNotes(root: NoteName, chord: string, octaves: number = 1) {
  // Note object for @root
  const note = Note({ name: root });

  // Create chord formula for @root@type
  const formula = chordFormula(chord);

  // Create array of octaves to map formula onto
  let octs = Array(octaves)
    .fill(0)
    .map((n, i) => i);

  // Array of chord formula extended by num of @octaves
  const transposed = octs.reduce((acc, curr) => (acc = acc.concat(transposeFormula(formula, curr))), []);

  // Convert @transposed array (Note.midi) to note name
  return transposed.map(i => note.midi + i).map(midiToNote);
}

export function modeToChords(name: string, root: NoteName) {
  const scaleMode = scale([root, name]).notes;
  const mode = MODES_CHORDS[name];
  return mode.map((ch, i) => chord([scaleMode[i], ch]).notes);
}
