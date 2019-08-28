import * as Theory from './theory';
import { CustomError } from '@base/error';
// import { chord } from '../chord';
// import { scale } from '@packages/scale';
import {
  isNegative,
  inSegment,
  lt,
  leq,
  eq,
  neq,
  gt,
  geq,
  cmp,
  tokenize,
  capitalize,
  substitute,
  either,
  inc,
  dec,
  and2 as both,
  isInteger,
  isNumber,
  curry,
} from '../../base/index';

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
const Midi = {
  toFrequency: (key: NoteMidi, tuning = Theory.A_440): NoteFreq =>
    tuning * 2 ** ((key - Theory.MIDDLE_KEY) / Theory.OCTAVE_RANGE),
  toOctaves: (key: NoteMidi) => Math.floor(key / Theory.OCTAVE_RANGE),
};

const Frequency = {
  toMidi: (freq: NoteFreq, tuning = Theory.A_440) =>
    Math.ceil(Theory.OCTAVE_RANGE * Math.log2(freq / tuning) + Theory.MIDDLE_KEY),
};

const Accidental = {
  toAlteration: (accidental: NoteAccidental): number => accidental.length * (accidental[0] === 'b' ? -1 : 1),
};

const Letter = {
  toStep: (letter: NoteLetter): number => (letter.charCodeAt(0) + 3) % 7,
  toIndex: (letter: NoteLetter) => Theory.SHARPS.indexOf(letter),
};

const Octave = {
  parse: (octave?: string): NoteOctave =>
    either(Number.parseInt(octave), Theory.STANDARD_OCTAVE, Number.isInteger(Number.parseInt(octave))),
  toSemitones: (octave: number) => Theory.OCTAVE_RANGE * inc(octave),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *               NOTE PROPS - VALIDATORS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
const Validators = {
  isName: (name: string): boolean => Theory.NOTE_REGEX.test(name) === true,
  isMidi: (midi: number): boolean => both(isInteger(midi), inSegment(0, 135, midi)),
  isChroma: (chroma: number): boolean => both(isInteger(chroma), inSegment(0, 11, chroma)),
  isFrequency: (freq: number): boolean => both(isNumber(freq), gt(freq, 0)),
  isKey: (key: string): boolean => Theory.KEYS.includes(key),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE FACTORIES                        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export function Note(props: InitProps): NoteProps {
  const { name, midi, frequency } = props;

  function createNoteWithName(note: NoteName): NoteProps {
    // Example: A#4

    if (!Validators.isName(note)) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const { Tletter, Taccidental, Toct, Trest } = tokenize(note, Theory.NOTE_REGEX);

    if (Trest) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const letter = capitalize(Tletter) as NoteLetter; // A
    const step = Letter.toStep(letter) as NoteStep; // 5

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental; // #
    const alteration = Accidental.toAlteration(accidental) as NoteAlteration; // +1

    /** Offset (number of keys) from first letter - C **/
    const offset = Letter.toIndex(letter); // 10

    /** Note position is calculated as: letter offset from the start + in place alteration **/
    const semitonesAltered = offset + alteration; // 11

    /** Because of the alteration, note can slip into the previous/next octave **/
    const octavesAltered = Math.floor(semitonesAltered / Theory.OCTAVE_RANGE); // 0
    const octave = Octave.parse(Toct) as NoteOctave; // 4

    const pc = (letter + accidental) as NotePC; // A#

    /**
     *  @example
     *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
     *  altered == -1
     *  alteredOct == -1
     */
    const chroma = either(
      (semitonesAltered - Octave.toSemitones(octavesAltered) + 12) % Theory.OCTAVE_RANGE,
      semitonesAltered % Theory.OCTAVE_RANGE,
      isNegative(octavesAltered),
    ) as NoteChroma; // 10

    const midi = (Octave.toSemitones(octave + octavesAltered) + chroma) as NoteMidi; // 70
    const frequency = Midi.toFrequency(midi) as NoteFreq; // 466.164

    const name = (pc + octave) as NoteName; // A#4

    const color = either('white', 'black', Theory.WHITE_KEYS.includes(chroma)) as NoteColor; // 'black'

    const valid = true;

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
    });
  }

  function createNoteWithMidi(midi: NoteMidi, useSharps = true): NoteProps {
    if (!Validators.isMidi(midi)) return NoteError('InvalidConstructor', { midi }, EmptyNote);
    const frequency = Midi.toFrequency(midi) as NoteFreq;
    const octave = dec(Midi.toOctaves(midi)) as NoteOctave;

    const chroma = (midi - Octave.toSemitones(octave)) as NoteChroma;
    const pc = either(Theory.SHARPS[chroma], Theory.FLATS[chroma], useSharps) as NotePC;

    const name = (pc + octave) as NoteName;

    const { Tletter, Taccidental } = tokenize(name, Theory.NOTE_REGEX);

    const letter = capitalize(Tletter) as NoteLetter;
    const step = Letter.toStep(letter) as NoteStep;

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
    const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

    const color = either('white', 'black', Theory.WHITE_KEYS.includes(chroma)) as NoteColor;

    const valid = true;

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
    });
  }

  function createNoteWithFreq(frequency: NoteFreq, tuning = Theory.A_440): NoteProps {
    if (!Validators.isFrequency(frequency)) return NoteError('InvalidConstructor', { frequency }, EmptyNote);

    const midi = Frequency.toMidi(frequency, tuning);
    return createNoteWithMidi(midi);
  }

  if (name && Validators && Validators.isName(name)) return createNoteWithName(name);

  if (isInteger(midi) && Validators.isMidi(midi)) return createNoteWithMidi(midi, true);

  if (frequency && Validators.isFrequency(frequency)) return createNoteWithFreq(frequency, 440);
  console.log('Here');

  return EmptyNote;
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     NOTE STATIC METHODS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

function property(prop: string) {
  return function(name: NoteName) {
    const note = Note({ name });
    return note && note[prop];
  };
}

function simplify(name: NoteName, keepAccidental = true): NoteName {
  const note = Note({ name });

  if (!note) return undefined;

  const { chroma, alteration, octave } = note;

  const isSharp = alteration >= 0;

  const useSharps = both(isSharp, keepAccidental) || both(!isSharp, !keepAccidental);

  const pc = either(Theory.SHARPS[chroma], Theory.FLATS[chroma], useSharps);

  return pc + octave;
}

function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}

function eitherOrder(fn: (x: number, y: number) => boolean, a: NoteProps, b?: NoteProps) {
  return b ? fn(a.midi, b.midi) : fn(this.midi, a.midi);
}

// const withChordExpansion = {
//   toChord: function(type: string, tonic?: NoteName) {
//     const name = this.name ? this.name : '';
//     return tonic ? chord([tonic, type]) : chord([name, type]);
//   },
// };

// const withScaleExpansion = {
//   toScale: function(type: string, tonic?: NoteName) {
//     const name = this.name ? this.name : '';
//     return tonic ? scale([tonic, type]) : scale([name, type]);
//   },
// };

const withExtension = {
  // ...withChordExpansion,
  // ...withScaleExpansion,
};

const transposeFn = (b: NoteProps, n: number) => Note({ midi: b.midi + n });

const distanceFn = (a: NoteProps, b: NoteProps, compare: NoteComparable = 'midi') => b[compare] - a[compare];

const relationsFn = {
  lt: (note: NoteProps, other: NoteProps, compare: NoteComparable = 'midi') => lt(note[compare], other[compare]),
  leq: (note: NoteProps, other: NoteProps, compare: NoteComparable = 'midi') => leq(note[compare], other[compare]),
  eq: (note: NoteProps, other: NoteProps, compare: NoteComparable = 'midi') => eq(note[compare], other[compare]),
  neq: (note: NoteProps, other: NoteProps, compare: NoteComparable = 'midi') => neq(note[compare], other[compare]),
  gt: (note: NoteProps, other: NoteProps, compare: NoteComparable = 'midi') => gt(note[compare], other[compare]),
  geq: (note: NoteProps, other: NoteProps, compare: NoteComparable = 'midi') => geq(note[compare], other[compare]),
  cmp: (note: NoteProps, other: NoteProps, compare: NoteComparable = 'midi') => cmp(note[compare], other[compare]),
};

const withTranspose = (prop: NoteProps) => ({
  transpose: curry(transposeFn)(prop),
});

const withDistance = (prop: NoteProps) => ({
  distance: curry(distanceFn)(prop),
});

const withComparison = (prop: NoteProps) => ({
  lt: (other: NoteProps, compare: NoteComparable = 'midi') => relationsFn.lt(prop, other, compare),
  leq: (other: NoteProps, compare: NoteComparable = 'midi') => relationsFn.leq(prop, other, compare),
  eq: (other: NoteProps, compare: NoteComparable = 'midi') => relationsFn.eq(prop, other, compare),
  neq: (other: NoteProps, compare: NoteComparable = 'midi') => relationsFn.neq(prop, other, compare),
  gt: (other: NoteProps, compare: NoteComparable = 'midi') => relationsFn.gt(prop, other, compare),
  geq: (other: NoteProps, compare: NoteComparable = 'midi') => relationsFn.geq(prop, other, compare),
  cmp: (other: NoteProps, compare: NoteComparable = 'midi') => relationsFn.cmp(prop, other, compare),
});

export const NoteBuilder = (initProps: NoteBuilderProps, from: InitProps) => {
  const { distance, transpose, compare, extend } = initProps;
  const note = Note(from);
  const distanceFn = distance ? withDistance(note) : null;
  const transposeFn = transpose ? withTranspose(note) : null;
  const comparisonFn = compare ? withComparison(note) : null;
  const extensionFn = extend ? withExtension : null;

  return {
    ...note,
    ...distanceFn,
    ...transposeFn,
    ...comparisonFn,
    ...extensionFn,
  };
};

export const NOTE = {
  Theory,
  Midi,
  Frequency,
  Accidental,
  Letter,
  Octave,
  Validators: Validators,
  property,
  simplify,
  enharmonic,
  distance: distanceFn,
  transpose: transposeFn,
  ...relationsFn,
};
