import { A_440, MIDDLE_KEY, OCTAVE_RANGE, SHARPS, STANDARD_OCTAVE, NOTE_REGEX, KEYS } from './theory';
import { either } from '@base/boolean';
import { inc } from '@base/math';
import { and2 as both } from '@base/logical';
import { isInteger, isNumber, isObject } from '@base/types';
import { inSegment, lt, leq, eq, neq, gt, geq, cmp, ComparableBinFn } from '@base/relations';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *               NOTE PROPS - VALIDATORS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const NoteValidator = {
  isName: (name: string): boolean => NOTE_REGEX.test(name) === true,
  isMidi: (midi: number): boolean => both(isInteger(midi), inSegment(0, 127, midi)),
  isChroma: (chroma: number): boolean => both(isInteger(chroma), inSegment(0, 11, chroma)),
  isFrequency: (freq: number): boolean => both(isNumber(freq), gt(freq, 0)),
  isKey: (key: string): boolean => KEYS.includes(key),
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
 *                    NOTE RELATIONS                       *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

function eitherOrder(fn: (x: number, y: number) => boolean, a: NoteProps, b?: NoteProps) {
  return b ? fn(a.midi, b.midi) : fn(this.midi, a.midi);
}
export const withComparison = {
  lt: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, lt, a, b);
  },
  leq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, leq, a, b);
  },
  eq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, eq, a, b);
  },
  neq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, neq, a, b);
  },
  gt: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, gt, a, b);
  },
  geq: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, geq, a, b);
  },
  cmp: function(a: NoteProps, b?: NoteProps) {
    return eitherOrder.call({ midi: this.midi }, cmp, a, b);
  },
};

export const withDistance = {
  distanceTo: function(a: NoteProps, b?: NoteProps) {
    return b ? b.midi - a.midi : a.midi - this.midi;
  },
};
