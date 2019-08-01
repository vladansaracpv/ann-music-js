import { A_440, MIDDLE_KEY, OCTAVE_RANGE, SHARPS, STANDARD_OCTAVE, NOTE_REGEX, KEYS } from './theory';
import { either } from '@base/boolean';
import { inc } from '@base/math';
import { and2 as both } from '@base/logical';
import { isInteger, isNumber, isUndefinedOrNull, isObject } from '@base/types';
import { inSegment, lt, leq, eq, neq, gt, geq, cmp } from '@base/relations';

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
/**
 *
 * @param key - Note property used for comparing
 * @param first - If there's only one param, it's used from object
 */
export const NoteRelations = (key: string, first?: number | string): NoteRelations<NoteProps> => ({
  lt: (a, b) => either(lt(a[key], b && b[key]), lt(first, a[key]), isObject(b)),
  leq: (a, b) => either(leq(a[key], b && b[key]), leq(first, a[key]), isObject(b)),
  eq: (a, b) => either(eq(a[key], b && b[key]), eq(first, a[key]), isObject(b)),
  neq: (a, b) => either(neq(a[key], b && b[key]), neq(first, a[key]), isObject(b)),
  gt: (a, b) => either(gt(a[key], b && b[key]), gt(first, a[key]), isObject(b)),
  geq: (a, b) => either(geq(a[key], b && b[key]), geq(first, a[key]), isObject(b)),
  cmp: (a, b) => either(cmp(a[key], b && b[key]), cmp(first, a[key]), isObject(b)),
});

export const withRelations = {
  lt: function(a: NoteProps, b?: NoteProps) {
    return b ? lt(a.midi, b.midi) : lt(this.midi, a.midi);
  },
  leq: function(a: NoteProps, b?: NoteProps) {
    return b ? leq(a.midi, b.midi) : leq(this.midi, a.midi);
  },
  eq: function(a: NoteProps, b?: NoteProps) {
    return b ? eq(a.midi, b.midi) : eq(this.midi, a.midi);
  },
  neq: function(a: NoteProps, b?: NoteProps) {
    return b ? neq(a.midi, b.midi) : neq(this.midi, a.midi);
  },
  gt: function(a: NoteProps, b?: NoteProps) {
    return b ? gt(a.midi, b.midi) : gt(this.midi, a.midi);
  },
  geq: function(a: NoteProps, b?: NoteProps) {
    return b ? geq(a.midi, b.midi) : geq(this.midi, a.midi);
  },
  cmp: function(a: NoteProps, b?: NoteProps) {
    return b ? cmp(a.midi, b.midi) : cmp(this.midi, a.midi);
  },
};

export const withDistance = {
  distanceTo: function(a: NoteProps, b?: NoteProps) {
    return b ? b.midi - a.midi : a.midi - this.midi;
  },
};
