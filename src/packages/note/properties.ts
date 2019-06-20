import { interval, segment, gt } from '@base/relations';
import { and2 as both } from '@base/logical';
import { either } from '@base/boolean';
import { isInteger, isNumber } from '@base/types';
import { Factory, createNoteWithName } from './factories';
import { inc } from '@base/math';
import { isString } from '@base/types';
import { A_440, MIDDLE_KEY, OCTAVE_RANGE, SHARPS, NOTE_REGEX, STANDARD_OCTAVE, FLATS } from './theory';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *               NOTE PROPS - VALIDATORS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const Validators = {
  isNoteName: (name: string): boolean => NOTE_REGEX.test(name) === true,
  isNoteMidi: (midi: number): boolean => both(isInteger(midi), segment(0, 127, midi)),
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
  toStep: (letter: NoteLetter): number => (letter.charCodeAt(0) + 3) % 7,
  toIndex: (letter: NoteLetter) => SHARPS.indexOf(letter),
};

export const Octave = {
  parse: (octave?: string): NoteOctave =>
    either(Number.parseInt(octave), STANDARD_OCTAVE, Number.isInteger(Number.parseInt(octave))),
  toSemitones: (octave: number) => OCTAVE_RANGE * inc(octave),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                NOTE - FUNCTIONS                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export function simplify(name: NoteName, useSameAccidental = true): NoteName {
  const note = Factory.fromName(name);

  if (!note) return undefined;

  const { chroma, alteration, octave } = note;

  const isSharp = alteration >= 0;

  const useSharps = both(isSharp, useSameAccidental) || both(!isSharp, !useSameAccidental);

  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps);

  return pc + octave;
}

export function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * *              NOTE PROPS - GETTERS                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export const property = (name: string) => (note: NoteName) => Factory.fromName(note) && Factory.fromName(note)[name];

export const name = property('name');

export const octave = property('octave');

export const letter = property('letter');

export const step = property('step');

export const accidental = property('accidental');

export const alteration = property('alteration');

export const pc = property('pc');

export const chroma = property('chroma');

export const midi = property('midi');

export const frequency = property('frequency');
