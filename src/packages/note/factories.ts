import * as Theory from './theory';
import { CustomError } from '@base/error';
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
} from '@base/index';

const NoteError = CustomError('Note');

const { EmptyNote } = Theory;

/**
 * Note object builder. Used to assign methods beside note properties
 * @param {NoteBuilderProps} initProps
 * @param {InitProps} from
 */
function NoteBuilder(initProps: NoteBuilderProps, from: InitProps) {
  const { distance, transpose, compare } = initProps;

  const note = Note(from);

  const transposeFns = {
    transpose: (n: number) => NOTE.transpose(note, n),
  };

  const distanceFns: NoteComparisonPartial = {
    distance: (other, comparable = 'midi') => NOTE.distance(note, other, comparable),
  };

  const partialCompare = (fn: NoteCompareFn): NoteComparePartialFn => (other, compare) => fn(note, other, compare);

  const compareFns: NoteComparisonPartial = {
    lt: partialCompare(NOTE.compare.lt),
    leq: partialCompare(NOTE.compare.leq),
    eq: partialCompare(NOTE.compare.eq),
    neq: partialCompare(NOTE.compare.neq),
    gt: partialCompare(NOTE.compare.gt),
    geq: partialCompare(NOTE.compare.geq),
    cmp: partialCompare(NOTE.compare.cmp),
  };

  const withTranspose = transpose ? transposeFns : {};

  const withDistance = distance ? distanceFns : {};

  const withCompare = compare ? compareFns : {};

  return {
    ...note,
    ...withTranspose,
    ...withDistance,
    ...withCompare,
  };
}

/**
 * Generate Note static methods
 */
function GenerateNoteStaticMethods() {
  const Midi = {
    toFrequency: function(key: NoteMidi, tuning = Theory.A_440): NoteFreq {
      return tuning * 2 ** ((key - Theory.MIDDLE_KEY) / Theory.OCTAVE_RANGE);
    },
    toOctaves: function(key: NoteMidi) {
      return Math.floor(key / Theory.OCTAVE_RANGE);
    },
  };

  const Frequency = {
    toMidi: function(freq: NoteFreq, tuning = Theory.A_440) {
      return Math.ceil(Theory.OCTAVE_RANGE * Math.log2(freq / tuning) + Theory.MIDDLE_KEY);
    },
  };

  const Accidental = {
    toAlteration: function(accidental: NoteAccidental): number {
      return accidental.length * (accidental[0] === 'b' ? -1 : 1);
    },
  };

  const Letter = {
    toStep: function(letter: NoteLetter): number {
      return (letter.charCodeAt(0) + 3) % 7;
    },
    toIndex: function(letter: NoteLetter) {
      return Theory.SHARPS.indexOf(letter);
    },
  };

  const Octave = {
    parse: function(octave?: string): NoteOctave {
      return either(Number.parseInt(octave), Theory.STANDARD_OCTAVE, Number.isInteger(Number.parseInt(octave)));
    },
    toSemitones: function(octave: number) {
      return Theory.OCTAVE_RANGE * inc(octave);
    },
  };

  const Validators = {
    isName: (name: string): boolean => Theory.NOTE_REGEX.test(name) === true,
    isMidi: (midi: number): boolean => both(isInteger(midi), inSegment(0, 135, midi)),
    isChroma: (chroma: number): boolean => both(isInteger(chroma), inSegment(0, 11, chroma)),
    isFrequency: (freq: number): boolean => both(isNumber(freq), gt(freq, 0)),
    isKey: (key: string): boolean => Theory.KEYS.includes(key),
  };

  const property = (prop: NoteProp) => (note: InitProps) => Note(note)[prop];

  function simplify(name: NoteName, keepAccidental = true): NoteName {
    const note = Note({ name });

    if (!note) return undefined;

    const { chroma, alteration, octave } = note;

    const isSharp = alteration >= 0;

    /**
     * Use sharps if:
     * 1) It's already sharp && keepAccidental = true
     * 2) It's not sharp && keepAccidental = false (don't use given accidental)
     */
    const useSharps = isSharp == keepAccidental;

    const pc = either(Theory.SHARPS[chroma], Theory.FLATS[chroma], useSharps);

    return pc + octave;
  }

  function enharmonic(note: NoteName): NoteName {
    return simplify(note, false);
  }

  function transpose(b: NoteProps, n: number) {
    return Note({ midi: b.midi + n });
  }

  function distance(note: NoteProps, other: NoteProps, compare: NoteComparable) {
    return other[compare] - note[compare];
  }

  const compare: NoteComparison = {
    lt: (note, other, compare) => lt(note[compare], other[compare]),
    leq: (note, other, compare) => leq(note[compare], other[compare]),
    eq: (note, other, compare) => eq(note[compare], other[compare]),
    neq: (note, other, compare) => neq(note[compare], other[compare]),
    gt: (note, other, compare) => gt(note[compare], other[compare]),
    geq: (note, other, compare) => geq(note[compare], other[compare]),
    cmp: (note, other, compare) => cmp(note[compare], other[compare]),
  };

  return {
    Midi,
    Frequency,
    Accidental,
    Letter,
    Octave,
    Validators,
    property,
    simplify,
    enharmonic,
    transpose,
    distance,
    compare,
  };
}

export const NOTE = {
  Theory,
  build: NoteBuilder,
  ...GenerateNoteStaticMethods(),
};

/**
 * Note factory function
 * @param {InitProps} props
 * @return {NoteProps}
 */
export function Note(props: InitProps): NoteProps {
  const { name, midi, frequency } = props;

  function createNoteWithName(note: NoteName): NoteProps {
    // Example: A#4

    if (!NOTE.Validators.isName(note)) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const { Tletter, Taccidental, Toct, Trest } = tokenize(note, Theory.NOTE_REGEX);

    if (Trest) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const letter = capitalize(Tletter) as NoteLetter; // A
    const step = NOTE.Letter.toStep(letter) as NoteStep; // 5

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental; // #
    const alteration = NOTE.Accidental.toAlteration(accidental) as NoteAlteration; // +1

    /** Offset (number of keys) from first letter - C **/
    const offset = NOTE.Letter.toIndex(letter); // 10

    /** Note position is calculated as: letter offset from the start + in place alteration **/
    const semitonesAltered = offset + alteration; // 11

    /** Because of the alteration, note can slip into the previous/next octave **/
    const octavesAltered = Math.floor(semitonesAltered / Theory.OCTAVE_RANGE); // 0
    const octave = NOTE.Octave.parse(Toct) as NoteOctave; // 4

    const pc = (letter + accidental) as NotePC; // A#

    /**
     *  @example
     *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
     *  altered == -1
     *  alteredOct == -1
     */
    const chroma = either(
      (semitonesAltered - NOTE.Octave.toSemitones(octavesAltered) + 12) % Theory.OCTAVE_RANGE,
      semitonesAltered % Theory.OCTAVE_RANGE,
      isNegative(octavesAltered),
    ) as NoteChroma; // 10

    const midi = (NOTE.Octave.toSemitones(octave + octavesAltered) + chroma) as NoteMidi; // 70
    const frequency = NOTE.Midi.toFrequency(midi) as NoteFreq; // 466.164

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
    if (!NOTE.Validators.isMidi(midi)) return NoteError('InvalidConstructor', { midi }, EmptyNote);
    const frequency = NOTE.Midi.toFrequency(midi) as NoteFreq;
    const octave = dec(NOTE.Midi.toOctaves(midi)) as NoteOctave;

    const chroma = (midi - NOTE.Octave.toSemitones(octave)) as NoteChroma;
    const pc = either(Theory.SHARPS[chroma], Theory.FLATS[chroma], useSharps) as NotePC;

    const name = (pc + octave) as NoteName;

    const { Tletter, Taccidental } = tokenize(name, Theory.NOTE_REGEX);

    const letter = capitalize(Tletter) as NoteLetter;
    const step = NOTE.Letter.toStep(letter) as NoteStep;

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
    const alteration = NOTE.Accidental.toAlteration(accidental) as NoteAlteration;

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
    if (!NOTE.Validators.isFrequency(frequency)) return NoteError('InvalidConstructor', { frequency }, EmptyNote);

    const midi = NOTE.Frequency.toMidi(frequency, tuning);
    return createNoteWithMidi(midi);
  }

  if (name && NOTE.Validators && NOTE.Validators.isName(name)) return createNoteWithName(name);

  if (isInteger(midi) && NOTE.Validators.isMidi(midi)) return createNoteWithMidi(midi, true);

  if (frequency && NOTE.Validators.isFrequency(frequency)) return createNoteWithFreq(frequency, 440);

  return EmptyNote;
}
