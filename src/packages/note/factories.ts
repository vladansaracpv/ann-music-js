import {
  BaseBoolean,
  BaseError,
  BaseFunctional,
  BaseMath,
  BaseRelations,
  BaseStrings,
  BaseTypings,
} from '@packages/base';

import * as Theory from './theory';

const {
  EmptyNote,
  A_440,
  MIDDLE_KEY,
  OCTAVE_RANGE,
  SHARPS,
  FLATS,
  STANDARD_OCTAVE,
  KEYS,
  NOTE_REGEX,
  WHITE_KEYS,
} = Theory;
const { isInteger, isNumber } = BaseTypings;
const { tokenize, capitalize, substitute } = BaseStrings;
const { isNegative, inSegment, lt, leq, eq, neq, gt, geq, cmp } = BaseRelations;
const { either, both } = BaseBoolean;
const { inc, dec } = BaseMath;
const NoteError = BaseError.CustomError('Note');
const { partial } = BaseFunctional;

/**
 * Generate Note static methods
 */
function GenerateNoteStaticMethods() {
  const Midi = {
    toFrequency(key: NoteMidi, tuning = A_440): NoteFreq {
      return tuning * 2 ** ((key - MIDDLE_KEY) / OCTAVE_RANGE);
    },
    toOctaves(key: NoteMidi) {
      return Math.floor(key / OCTAVE_RANGE);
    },
  };

  const Frequency = {
    toMidi(freq: NoteFreq, tuning = A_440) {
      return Math.ceil(OCTAVE_RANGE * Math.log2(freq / tuning) + MIDDLE_KEY);
    },
  };

  const Accidental = {
    toAlteration(accidental: NoteAccidental): number {
      return accidental.length * (accidental[0] === 'b' ? -1 : 1);
    },
  };

  const Letter = {
    toStep(letter: NoteLetter): number {
      return (letter.charCodeAt(0) + 3) % 7;
    },
    toIndex(letter: NoteLetter) {
      return SHARPS.indexOf(letter);
    },
  };

  const Octave = {
    parse(octave?: string): NoteOctave {
      return either(Number.parseInt(octave), STANDARD_OCTAVE, Number.isInteger(Number.parseInt(octave)));
    },
    toSemitones(octave: number) {
      return OCTAVE_RANGE * inc(octave);
    },
  };

  const Validators = {
    isName: (name: NoteName): boolean => NOTE_REGEX.test(name) === true,
    isMidi: (midi: NoteMidi): boolean => both(isInteger(midi), inSegment(0, 135, midi)),
    isChroma: (chroma: NoteChroma): boolean => both(isInteger(chroma), inSegment(0, 11, chroma)),
    isFrequency: (freq: NoteFreq): boolean => both(isNumber(freq), gt(freq, 0)),
    isKey: (key: string): boolean => KEYS.includes(key),
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

    const pc = either(SHARPS[chroma], FLATS[chroma], useSharps);

    return pc + octave;
  }

  function enharmonic(note: NoteName): NoteName {
    return simplify(note, false);
  }

  function transpose(b: NoteProps, n: number, key = 'midi'): Note {
    return key == 'midi'
      ? Note({ midi: b.midi + n })
      : key == 'frequency'
      ? Note({ frequency: b.frequency + n })
      : Note({ name: b.pc + (b.octave + n) });
  }

  function distance(note: Note, other: Note, compare: NoteComparableKeys): number {
    return other[compare] - note[compare];
  }

  const compare: NoteComparison = {
    lt: (note, other, compare = 'midi') => lt(note[compare], other[compare]),
    leq: (note, other, compare = 'midi') => leq(note[compare], other[compare]),
    eq: (note, other, compare = 'midi') => eq(note[compare], other[compare]),
    neq: (note, other, compare = 'midi') => neq(note[compare], other[compare]),
    gt: (note, other, compare = 'midi') => gt(note[compare], other[compare]),
    geq: (note, other, compare = 'midi') => geq(note[compare], other[compare]),
    cmp: (note, other, compare = 'midi') => cmp(note[compare], other[compare]),
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
    ...compare,
  };
}

export const NOTE = {
  Theory,
  withMethods: NoteBuilder,
  ...GenerateNoteStaticMethods(),
};

/**
 * Note factory function
 * @param {InitProps} props
 * @return {Note}
 */
export function Note(props: InitProps): Note {
  const { name, midi, frequency } = props;
  const { isName, isMidi, isFrequency } = NOTE.Validators;
  const { toIndex, toStep } = NOTE.Letter;
  const { toAlteration } = NOTE.Accidental;
  const { toSemitones, parse } = NOTE.Octave;
  const { toFrequency, toOctaves } = NOTE.Midi;
  const { toMidi } = NOTE.Frequency;

  function fromName(note: NoteName): Note {
    // Example: A#4

    if (!isName(note)) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const { Tletter, Taccidental, Toct, Trest } = tokenize(note, NOTE_REGEX);

    if (Trest) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const letter = capitalize(Tletter) as NoteLetter; // A
    const step = toStep(letter) as NoteStep; // 5

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental; // #
    const alteration = toAlteration(accidental) as NoteAlteration; // +1

    /** Offset (number of keys) from first letter - C **/
    const offset = toIndex(letter); // 10

    /** Note position is calculated as: letter offset from the start + in place alteration **/
    const semitonesAltered = offset + alteration; // 11

    /** Because of the alteration, note can slip into the previous/next octave **/
    const octavesAltered = Math.floor(semitonesAltered / OCTAVE_RANGE); // 0
    const octave = parse(Toct) as NoteOctave; // 4

    const pc = (letter + accidental) as NotePC; // A#

    /**
     *  @example
     *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
     *  altered == -1
     *  alteredOct == -1
     */
    const chroma = either(
      (semitonesAltered - toSemitones(octavesAltered) + 12) % OCTAVE_RANGE,
      semitonesAltered % OCTAVE_RANGE,
      isNegative(octavesAltered),
    ) as NoteChroma; // 10

    const midi = (toSemitones(octave + octavesAltered) + chroma) as NoteMidi; // 70
    const frequency = toFrequency(midi) as NoteFreq; // 466.164

    const name = (pc + octave) as NoteName; // A#4

    const color = either('white', 'black', WHITE_KEYS.includes(chroma)) as NoteColor; // 'black'

    const valid = true;

    return {
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
    };
  }

  function fromMidi(midi: NoteMidi, useSharps = true): Note {
    if (!isMidi(midi)) return NoteError('InvalidConstructor', { midi }, EmptyNote);
    const frequency = toFrequency(midi) as NoteFreq;
    const octave = dec(toOctaves(midi)) as NoteOctave;

    const chroma = (midi - toSemitones(octave)) as NoteChroma;
    const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

    const name = (pc + octave) as NoteName;

    const { Tletter, Taccidental } = tokenize(name, NOTE_REGEX);

    const letter = capitalize(Tletter) as NoteLetter;
    const step = toStep(letter) as NoteStep;

    const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
    const alteration = toAlteration(accidental) as NoteAlteration;

    const color = either('white', 'black', WHITE_KEYS.includes(chroma)) as NoteColor;

    const valid = true;

    return {
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
    };
  }

  function fromFrequency(frequency: NoteFreq, tuning = A_440): Note {
    if (!isFrequency(frequency)) return NoteError('InvalidConstructor', { frequency }, EmptyNote);

    const midi = toMidi(frequency, tuning);
    return fromMidi(midi);
  }

  return isName(name)
    ? fromName(name)
    : isMidi(midi)
    ? fromMidi(midi, true)
    : isFrequency(frequency)
    ? fromFrequency(frequency, 440)
    : EmptyNote;
}

/**
 * Note object builder. Used to assign methods beside note properties
 * @param {NoteBuilderProps} initProps
 * @param {InitProps} from
 */
function NoteBuilder(initProps: NoteBuilderProps, from: InitProps): NoteBuilder {
  const { distance, transpose, compare } = initProps;

  const note = Note(from) as NoteProps;

  const transposeFns: NoteTranspositionPartial = {
    transpose: (by: number, key = 'midi') => NOTE.transpose(note, by, key),
  };

  const distanceFns: NoteDistancePartial = {
    distance: (other, comparable: NoteComparableKeys = 'midi') => NOTE.distance(note, other, comparable),
  };

  const partialCmp = (fn: NoteCompareFn): NoteCompareFnPartial => partial(fn, note);

  const compareFns: NoteComparisonPartial = {
    lt: partialCmp(NOTE.lt),
    leq: partialCmp(NOTE.leq),
    eq: partialCmp(NOTE.eq),
    neq: partialCmp(NOTE.neq),
    gt: partialCmp(NOTE.gt),
    geq: partialCmp(NOTE.geq),
    cmp: partialCmp(NOTE.cmp),
  };

  const withTranspose = transpose && transposeFns;

  const withDistance = distance && distanceFns;

  const withCompare = compare && compareFns;

  return {
    ...note,
    ...withTranspose,
    ...withDistance,
    ...withCompare,
  };
}
