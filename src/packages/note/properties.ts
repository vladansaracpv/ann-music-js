import { interval, segment, gt } from '@base/relations';
import { and2 as both } from '@base/logical';
import { either } from '@base/boolean';
import { isInteger, isNumber } from '@base/types';
import { Note } from './factories';
import { inc } from '@base/math';
import { isString } from '@base/types';
import { A_440, MIDDLE_KEY, OCTAVE_RANGE, SHARPS, NOTE_REGEX, STANDARD_OCTAVE } from './theory';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *               NOTE PROPS - VALIDATORS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const Validators = {
  isNoteName: (name: string): boolean => NOTE_REGEX.test(name) === true,
  isNoteMidi: (midi: number): boolean => both(isInteger(midi), interval(0, 128, midi)),
  isNoteChroma: (chroma: number): boolean => both(isInteger(chroma), segment(0, 11, chroma)),
  isNoteFreq: (freq: number): boolean => both(isNumber(freq), gt(freq, 0)),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *               NOTE PROPS - HELPER FUNCTIONS             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const Midi = {
  toFrequency: (key: NoteMidi, tuning = A_440): NoteFreq => tuning * 2 ** ((key - MIDDLE_KEY) / OCTAVE_RANGE),
  toOctaves: (key: NoteMidi) => Math.floor(key / OCTAVE_RANGE),
};

export const Frequency = {
  toMidi: (freq: NoteFreq, tuning = A_440) => Math.ceil(OCTAVE_RANGE * Math.log2(freq / tuning) + MIDDLE_KEY),
};

export const Accidental = {
  toAlteration: (accidental: NoteAccidental): number => accidental.length * (accidental[0] === 'b' ? -1 : 1),
};

export const Letter = {
  stepOf: (letter: NoteLetter): number => (letter.charCodeAt(0) + 3) % 7,
  indexOf: (letter: NoteLetter) => SHARPS.indexOf(letter),
};

export const Octave = {
  parse: (octave?: string): NoteOctave => either(+octave, STANDARD_OCTAVE, isString(octave)),
  toSemitones: (octave: number) => OCTAVE_RANGE * inc(octave),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * *              NOTE PROPS - GETTERS                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

const property = (name: string) => (note: NoteName) => {
  return Note({ name: note }) && Note({ name: note })[name];
};

export const name: (a: NoteName) => NoteName = property('name');

export const octave: (a: NoteName) => NoteOctave = property('octave');

export const letter: (a: NoteName) => NoteLetter = property('letter');

export const step: (a: NoteName) => NoteStep = property('step');

export const accidental: (a: NoteName) => NoteAccidental = property('accidental');

export const alteration: (a: NoteName) => NoteAlteration = property('alteration');

export const pc: (a: NoteName) => NotePC = property('pc');

export const chroma: (a: NoteName) => NoteChroma = property('chroma');

export const midi: (a: NoteName) => NoteMidi = property('midi');

export const frequency: (a: NoteName) => NoteFreq = property('frequency');
