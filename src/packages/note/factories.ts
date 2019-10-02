import { Base } from '@packages/base';

import { EmptyNote, A_440, A4_KEY, OCT_RANGE, SHARPS, FLATS, OCTAVE, KEYS, REGEX, WHITE_KEYS } from './theory';
import { compose2 } from '@packages/base/functional';

const { either, both } = Base.Boolean;
const { partial } = Base.Functional;

const NoteError = Base.Errors.CustomError('Note');

/**
 * Generate Note static methods
 */

function StaticMethods() {
  const { isInteger, isNumber } = Base.Typings;
  const { inc } = Base.Maths;
  const { inSegment, gt, isPositive } = Base.Relations;

  const Midi = {
    toFrequency: (key: NoteMidi, tuning = A_440): NoteFreq => tuning * 2 ** ((key - A4_KEY) / OCT_RANGE),
    toOctaves: (key: NoteMidi) => Math.floor(key / OCT_RANGE),
  };

  const Frequency = {
    toMidi: (freq: NoteFreq, tuning = A_440) => Math.ceil(OCT_RANGE * Math.log2(freq / tuning) + A4_KEY),
  };

  const Accidental = {
    toAlteration: (accidental: NoteAccidental) => accidental.length * (accidental[0] === 'b' ? -1 : 1),
  };

  const Letter = {
    toStep: (letter: NoteLetter) => (letter.charCodeAt(0) + 3) % 7,
    toIndex: (letter: NoteLetter) => SHARPS.indexOf(letter),
  };

  const Octave = {
    parse: (octave?: string): NoteOctave =>
      either(Number.parseInt(octave), OCTAVE, Number.isInteger(Number.parseInt(octave))),
    toSemitones: (octave: number) => OCT_RANGE * inc(octave),
  };

  const Validators = {
    isName: (name: NoteName): boolean => REGEX.test(name) === true,
    isMidi: (midi: NoteMidi): boolean => both(isInteger(midi), inSegment(0, 135, midi)),
    isChroma: (chroma: NoteChroma): boolean => both(isInteger(chroma), inSegment(0, 11, chroma)),
    isFrequency: (freq: NoteFreq): boolean => both(isNumber(freq), gt(freq, 0)),
    isKey: (key: string): boolean => KEYS.includes(key),
  };

  const property = (prop: NoteProp) => (note: InitProp) => Note(note)[prop];

  function simplify(name: NoteName, keepAccidental = true): NoteName {
    const note = Note(name);

    if (!note) return undefined;

    const { chroma, alteration, octave } = note;

    const isSharp = isPositive(alteration);

    /**
     * Use sharps if:
     * 1) It's already sharp && keepAccidental = true
     * 2) It's not sharp && keepAccidental = false (don't use given accidental)
     */
    const pc = either(SHARPS[chroma], FLATS[chroma], isSharp == keepAccidental);

    return pc + octave;
  }

  function enharmonic(note: NoteName): NoteName {
    return simplify(note, false);
  }

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
  };
}

function TransposeMethods(isPartialFn = false, note?: NoteProps): NoteTransposeFns | NoteTransposeByFns {
  function transposeNote(b: NoteProps, n: number, key: NoteTransposableProp = 'midi'): Note {
    return key == 'midi' ? Note(b.midi + n) : key == 'frequency' ? Note(b.frequency + n) : Note(b.pc + (b.octave + n));
  }

  return {
    transpose: either(partial(transposeNote, note), transposeNote, isPartialFn),
  };
}

function DistanceMethods(isPartialFn = false, note?: NoteProps): NoteDistanceFns | NoteDistanceToFns {
  function distanceNote(note: Note, other: Note, compare: NoteComparableProp): number {
    return other[compare] - note[compare];
  }

  return {
    distance: either(partial(distanceNote, note), distanceNote, isPartialFn),
  };
}

function CompareMethods(isPartialFn = false, note?: NoteProps) {
  const { lt, leq, eq, neq, gt, geq, cmp } = Base.Relations;

  const toComparable = (note: NoteProps, other: NoteProps, prop: NoteComparableProp = 'midi') =>
    [note, other].map(n => n[prop]);

  const note2Comparable = (fn: Function) => compose2(fn, toComparable);

  const ltn: NoteCompareFn = (...args) => note2Comparable(lt)(...args);
  const leqn: NoteCompareFn = (...args) => note2Comparable(leq)(...args);
  const eqn: NoteCompareFn = (...args) => note2Comparable(eq)(...args);
  const neqn: NoteCompareFn = (...args) => note2Comparable(neq)(...args);
  const gtn: NoteCompareFn = (...args) => note2Comparable(gt)(...args);
  const geqn: NoteCompareFn = (...args) => note2Comparable(geq)(...args);
  const cmpn: NoteCompareFn = (...args) => note2Comparable(cmp)(...args);

  const compareNotes: NoteCompareFns = {
    lt: ltn,
    leq: leqn,
    eq: eqn,
    neq: neqn,
    gt: gtn,
    geq: geqn,
    cmp: cmpn,
  };

  const compareNoteTo: NoteCompareToFns = {
    lt: partial(ltn, note),
    leq: partial(leqn, note),
    eq: partial(eqn, note),
    neq: partial(neqn, note),
    gt: partial(gtn, note),
    geq: partial(geqn, note),
    cmp: partial(cmpn, note),
  };

  return isPartialFn ? compareNoteTo : compareNotes;
}

/**
 * Note object builder. Used to assign methods beside note properties
 * @param {NoteBuilderProps} initProps
 * @param {InitProps} from
 */
function NoteBuilder(initMethods: NoteBuilderProps, from: InitProp): NoteBuilder {
  NoteBuilder;
  const { distance: useDistance, transpose: useTranspose, compare: useCompare } = initMethods;
  const note = Note(from) as NoteProps;

  const transposeMethods: NoteTransposeByFns = useTranspose && (TransposeMethods(true, note) as NoteTransposeByFns);

  const distanceMethods: NoteDistanceToFns = useDistance && (DistanceMethods(true, note) as NoteDistanceToFns);

  const compareMethods: NoteCompareToFns = useCompare && (CompareMethods(true, note) as NoteCompareToFns);

  return {
    ...note,
    ...transposeMethods,
    ...distanceMethods,
    ...compareMethods,
  };
}

export const NoteStatic = {
  ...StaticMethods(),
  ...(TransposeMethods() as NoteTransposeFns),
  ...(DistanceMethods() as NoteDistanceFns),
  ...(CompareMethods() as NoteCompareFns),
  withMethods: NoteBuilder,
};

/**
 * Note factory function
 * @param {InitProps} props
 * @return {Note}
 */
export function Note(prop: InitProp): Note {
  const name = prop as NoteName;
  const midi = prop as NoteMidi;
  const frequency = prop as NoteFreq;
  const { isName, isMidi, isFrequency } = NoteStatic.Validators;
  const { toIndex, toStep } = NoteStatic.Letter;
  const { toAlteration } = NoteStatic.Accidental;
  const { toSemitones, parse } = NoteStatic.Octave;
  const { toFrequency, toOctaves } = NoteStatic.Midi;
  const { toMidi } = NoteStatic.Frequency;

  const { tokenize, capitalize, substitute } = Base.Strings;

  function fromName(note: NoteName): Note {
    // Example: A#4

    if (!isName(note)) return NoteError('InvalidConstructor', { name: note }, EmptyNote);

    const { isNegative } = Base.Relations;

    const { Tletter, Taccidental, Toct, Trest } = tokenize(note, REGEX);

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
    const octavesAltered = Math.floor(semitonesAltered / OCT_RANGE); // 0
    const octave = parse(Toct) as NoteOctave; // 4

    const pc = (letter + accidental) as NotePC; // A#

    /**
     *  @example
     *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
     *  altered == -1
     *  alteredOct == -1
     */
    const chroma = either(
      (semitonesAltered - toSemitones(octavesAltered) + 12) % OCT_RANGE,
      semitonesAltered % OCT_RANGE,
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
    const { dec } = Base.Maths;
    const frequency = toFrequency(midi) as NoteFreq;
    const octave = dec(toOctaves(midi)) as NoteOctave;

    const chroma = (midi - toSemitones(octave)) as NoteChroma;
    const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

    const name = (pc + octave) as NoteName;

    const { Tletter, Taccidental } = tokenize(name, REGEX);

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
