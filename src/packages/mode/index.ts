import { Note } from '@packages/note';
import { chordFormula, Chord } from '@packages/chord';
import { Scale } from '@packages/scale';
import { MODES_CHORDS } from './theory';
import { modes as chromaModes } from '@packages/pc';
export * from './dictionary';

const midiToNote = (midi: NoteMidi) => Note(midi).name;

const transposeFormula = (formula: number[], octave: number) => formula.map(t => t + 12 * octave);

export function chordNotes(root: NoteName, chord: string, octaves: number = 1) {
  // Note object for @root
  const note = Note(root);

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
  const scaleMode = Scale([root, name]).notes;
  const mode = MODES_CHORDS[name];
  return mode.map((ch, i) => Chord([scaleMode[i], ch]).notes);
}

export function scaleModes(src: ScaleName | ScaleNameTokens) {
  const chroma = Scale(src).chroma;
  return chromaModes(chroma).map(mode => Scale(mode));
}
