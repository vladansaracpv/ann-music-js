import { A_440, MIDDLE_KEY, OCTAVE_RANGE, SHARPS, STANDARD_OCTAVE, NOTE_REGEX, KEYS } from './theory';
import { either } from '@base/boolean';
import { inc } from '@base/math';
import { and2 as both } from '@base/logical';
import { isInteger, isNumber } from '@base/types';
import { Comparable, inSegment, lt, leq, eq, neq, gt, geq, cmp } from '@base/relations';

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

interface GenericBinRelations<T> {
  lt(a: T, b: T): boolean;
  leq(a: T, b: T): boolean;
  eq(a: T, b: T): boolean;
  neq(a: T, b: T): boolean;
  gt(a: T, b: T): boolean;
  geq(a: T, b: T): boolean;
  cmp(a: T, b: T): number;
}

export const NoteBinRelations = (comparableKey: string): GenericBinRelations<NoteProps> => ({
  lt: (a, b) => lt(a[comparableKey], b[comparableKey]),
  leq: (a, b) => leq(a[comparableKey], b[comparableKey]),
  eq: (a, b) => eq(a[comparableKey], b[comparableKey]),
  neq: (a, b) => neq(a[comparableKey], b[comparableKey]),
  gt: (a, b) => gt(a[comparableKey], b[comparableKey]),
  geq: (a, b) => geq(a[comparableKey], b[comparableKey]),
  cmp: (a, b) => cmp(a[comparableKey], b[comparableKey]),
});

interface GenericRelations<T> {
  lt(b: T): boolean;
  leq(b: T): boolean;
  eq(b: T): boolean;
  neq(b: T): boolean;
  gt(b: T): boolean;
  geq(b: T): boolean;
  cmp(b: T): number;
}

export const NoteRelations = (first: Comparable, comparableKey: string): GenericRelations<NoteProps> => ({
  lt: b => lt(first, b[comparableKey]),
  leq: b => leq(first, b[comparableKey]),
  eq: b => eq(first, b[comparableKey]),
  neq: b => neq(first, b[comparableKey]),
  gt: b => gt(first, b[comparableKey]),
  geq: b => geq(first, b[comparableKey]),
  cmp: b => cmp(first, b[comparableKey]),
});
