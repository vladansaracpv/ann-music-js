/* eslint-disable @typescript-eslint/no-use-before-define */
import { tokenize, capitalize, substitute } from '@base/strings';
import { isNegative, inSegment, lt, leq, eq, neq, gt, geq, cmp } from '@base/relations';
import { either } from '@base/boolean';
import { CustomError } from '@base/error';
import { inc } from '@base/math';
import {
  OCTAVE_RANGE,
  NOTE_REGEX,
  FLATS,
  SHARPS,
  A_440,
  WHITE_KEYS,
  KEYS,
  MIDDLE_KEY,
  STANDARD_OCTAVE,
} from './theory';
import { and2 as both } from '@base/logical';
import { isInteger, isNumber } from '@base/types';

const NoteError = CustomError('Note');

const EmptyNote: NoteProps = {
  name: undefined,
  letter: undefined,
  step: undefined,
  octave: undefined,
  accidental: undefined,
  alteration: undefined,
  pc: undefined,
  chroma: undefined,
  midi: undefined,
  frequency: undefined,
  color: undefined,
  valid: false,
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
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE FACTORIES                        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export const Note = (props: InitProps): NoteProps => {
  const { name, midi, frequency } = props;

  function createNoteWithName(note: NoteName): NoteProps {
    // Example: A#4

    if (!NoteValidator.isName(note)) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const { Tletter, Taccidental, Toct } = tokenize(note, NOTE_REGEX);

    const letter = capitalize(Tletter) as NoteLetter; // A
    const step = Letter.toStep(letter) as NoteStep; // 5

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental; // #
    const alteration = Accidental.toAlteration(accidental) as NoteAlteration; // +1

    /** Offset (number of keys) from first letter - C **/
    const offset = Letter.toIndex(letter); // 10

    /** Note position is calculated as: letter offset from the start + in place alteration **/
    const semitonesAltered = offset + alteration; // 11

    /** Because of the alteration, note can slip into the previous/next octave **/
    const octavesAltered = Math.floor(semitonesAltered / OCTAVE_RANGE); // 0
    const octave = Octave.parse(Toct) as NoteOctave; // 4

    const pc = (letter + accidental) as NotePC; // A#

    /**
     *  @example
     *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
     *  altered == -1
     *  alteredOct == -1
     */
    const chroma = either(
      (semitonesAltered - Octave.toSemitones(octavesAltered) + 12) % OCTAVE_RANGE,
      semitonesAltered % OCTAVE_RANGE,
      isNegative(octavesAltered),
    ) as NoteChroma; // 10

    const midi = (Octave.toSemitones(octave + octavesAltered) + chroma) as NoteMidi; // 70
    const frequency = Midi.toFrequency(midi) as NoteFreq; // 466.164

    const name = (pc + octave) as NoteName; // A#4

    const color = either('white', 'black', WHITE_KEYS.includes(chroma)); // 'black'
    const valid = true;
    // const distanceTo = methods.withDistance ? withDistance.distanceTo : undefined;
    // const transposeBy = methods.withTransposition ? (n: number) => Note({ midi: midi + n, ...methods }) : undefined;

    return Object.freeze({
      name,
      letter,
      step,
      accidental,
      alteration,
      octave,
      pc,
      chroma,
      midi,
      frequency,
      color,
      valid,
      ...withDistance,
      ...withComparison,
      ...withTranspose,
      // transposeBy,
    });
  }

  function createNoteWithMidi(midi: NoteMidi, useSharps = true): NoteProps {
    if (!NoteValidator.isMidi(midi)) return NoteError('InvalidConstructor', { midi }, EmptyNote);

    const frequency = Midi.toFrequency(midi) as NoteFreq;
    const octave = (Midi.toOctaves(midi) - 1) as NoteOctave;

    const chroma = (midi - Octave.toSemitones(octave)) as NoteChroma;
    const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

    const name = (pc + octave) as NoteName;

    const { Tletter, Taccidental } = tokenize(name, NOTE_REGEX);

    const letter = capitalize(Tletter) as NoteLetter;
    const step = Letter.toStep(letter) as NoteStep;

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
    const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

    const color = either('white', 'black', WHITE_KEYS.includes(chroma)) as NoteColor;

    const valid = true;
    // const op = methods.withComparison ? NoteRelations('midi', midi) : undefined;
    // const distanceTo = methods.withDistance ? withDistance.distanceTo : undefined;
    // const transposeBy = methods.withTransposition ? (n: number) => Note({ midi: midi + n, ...methods }) : undefined;

    return Object.freeze({
      name,
      letter,
      step,
      accidental,
      alteration,
      octave,
      pc,
      chroma,
      midi,
      frequency,
      color,
      valid,
      ...withDistance,
      ...withComparison,
      ...withTranspose,
      // op,
      // distanceTo,
      // transposeBy,
    });
  }

  function createNoteWithFreq(freq: NoteFreq, tuning = A_440): NoteProps {
    if (!NoteValidator.isFrequency(freq)) return NoteError('InvalidConstructor', { frequency: freq }, EmptyNote);

    const midi = Frequency.toMidi(freq, tuning);
    return createNoteWithMidi(midi);
  }

  if (name && NoteValidator.isName(name)) return createNoteWithName(name);
  if (midi && NoteValidator.isMidi(midi)) return createNoteWithMidi(midi);
  if (frequency && NoteValidator.isFrequency(frequency)) return createNoteWithFreq(frequency);
  return EmptyNote;
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE STATIC METHODS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

const property = (prop: string) => (name: NoteName) => {
  const note = Note({ name });
  return note && note[prop];
};

function simplify(name: NoteName, sameSign = true): NoteName {
  const note = Note({ name });

  if (!note) return undefined;

  const { chroma, alteration, octave } = note;

  const isSharp = alteration >= 0;

  const useSharps = both(isSharp, sameSign) || both(!isSharp, !sameSign);

  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps);

  return pc + octave;
}

function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}

function eitherOrder(fn: (x: number, y: number) => boolean, a: NoteProps, b?: NoteProps) {
  return b ? fn(a.midi, b.midi) : fn(this.midi, a.midi);
}

export const withTranspose = {
  transposeBy: function(n: number, b?: NoteProps) {
    return b ? Note({ midi: b.midi + n }) : Note({ midi: this.midi + n });
  },
};

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

export const NoteStatic = {
  simplify,
  enharmonic,
  name: property('name'),
  octave: property('octave'),
  letter: property('letter'),
  step: property('step'),
  accidental: property('accidental'),
  alteration: property('alteration'),
  pc: property('pc'),
  chroma: property('chroma'),
  midi: property('midi'),
  frequency: property('frequency'),
  color: property('color'),
  valid: property('valid'),
  ...withComparison,
  ...withDistance,
  ...withTranspose,
};
