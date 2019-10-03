import { Base } from '@packages/base';

import { EmptyNote, A_440, A4_KEY, OCT_RANGE, SHARPS, FLATS, OCTAVE, KEYS, REGEX, WHITE_KEYS } from './theory';
import { compose2 } from '@packages/base/functional';

const { either, both } = Base.Boolean;
const { partial } = Base.Functional;
const { isObject } = Base.Typings;

const NoteError = Base.Errors.CustomError('Note');

/**
 * Generate Note static methods
 */

function StaticMethods() {
  const { isInteger, isNumber } = Base.Typings;
  const { inc } = Base.Maths;
  const { inSegment, gt, isPositive } = Base.Relations;

  const Midi = {
    toFrequency: (midi: NoteMidi, tuning = A_440): NoteFreq => 2 ** ((midi - A4_KEY) / OCT_RANGE) * tuning,
    toOctaves: (midi: NoteMidi) => Math.floor(midi / OCT_RANGE),
  };

  const Frequency = {
    toMidi: (f: NoteFreq, tuning = A_440) => Math.ceil(OCT_RANGE * Math.log2(f / tuning) + A4_KEY),
  };

  const Accidental = {
    toAlteration: (accidental: NoteAccidental) => accidental.length * (accidental[0] === 'b' ? -1 : 1),
  };

  const Letter = {
    toStep: (letter: NoteLetter) => (letter.charCodeAt(0) + 3) % 7,
    toIndex: (letter: NoteLetter) => SHARPS.indexOf(letter),
  };

  const Octave = {
    parse: (octave?: string): NoteOctave => either(Number.parseInt(octave), 4, isInteger(Number.parseInt(octave))),
    toSemitones: (octave: number) => OCT_RANGE * inc(octave),
  };

  const Validators = {
    isName: (name: InitProp): name is NoteName => REGEX.test(name as string) === true,
    isMidi: (midi: InitProp): midi is NoteMidi => both(isInteger(midi), inSegment(0, 135, midi as number)),
    isChroma: (chroma: NoteChroma): boolean => both(isInteger(chroma), inSegment(0, 11, chroma as number)),
    isFrequency: (freq: InitProp): freq is NoteFreq => both(isNumber(freq), gt(freq, 0)),
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
  function distanceNote(note: NoteProps, other: NoteProps, compare: NoteComparableProp = 'midi'): number {
    return other[compare] - note[compare];
  }

  return {
    distance: either(partial(distanceNote, note), distanceNote, isPartialFn),
  };
}

function CompareMethods(isPartialFn = false, note?: NoteProps): NoteCompareFns | NoteCompareToFns {
  const { lt, leq, eq, neq, gt, geq, cmp } = Base.Relations;

  const NoteRelation = (fn: Function): NoteCompareFn => (a, b, c = 'midi') => fn(a[c], b[c]);

  const ltn = NoteRelation(lt);
  const leqn = NoteRelation(leq);
  const eqn = NoteRelation(eq);
  const neqn = NoteRelation(neq);
  const gtn = NoteRelation(gt);
  const geqn = NoteRelation(geq);
  const cmpn = NoteRelation(cmp);

  return {
    ltn: either(partial(ltn, note), ltn, isPartialFn),
    leqn: either(partial(leqn, note), leqn, isPartialFn),
    eqn: either(partial(eqn, note), eqn, isPartialFn),
    neqn: either(partial(neqn, note), neqn, isPartialFn),
    gtn: either(partial(gtn, note), gtn, isPartialFn),
    geqn: either(partial(geqn, note), geqn, isPartialFn),
    cmpn: either(partial(cmpn, note), cmpn, isPartialFn),
  };
}

export const NoteStatic = {
  ...StaticMethods(),
  ...(TransposeMethods() as NoteTransposeFns),
  ...(DistanceMethods() as NoteDistanceFns),
  ...(CompareMethods() as NoteCompareFns),
};

/**
 * Note factory function
 * @param {InitProp} prop
 * @param {NoteBuilderProps} initMethods
 * @return {NoteType}
 */
export function Note(prop: InitProp): NoteType {
  const { isName, isMidi, isFrequency } = NoteStatic.Validators;
  const { toIndex, toStep } = NoteStatic.Letter;
  const { toAlteration } = NoteStatic.Accidental;
  const { toSemitones, parse } = NoteStatic.Octave;
  const { toFrequency, toOctaves } = NoteStatic.Midi;
  const { toMidi } = NoteStatic.Frequency;
  const { tokenize, capitalize, substitute } = Base.Strings;

  function fromName(note: NoteName): NoteType {
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

  function fromMidi(midi: NoteMidi, useSharps = true): NoteType {
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

  function fromFrequency(frequency: NoteFreq, tuning = A_440): NoteType {
    if (!isFrequency(frequency)) return NoteError('InvalidConstructor', { frequency }, EmptyNote);

    const midi = toMidi(frequency, tuning);
    return fromMidi(midi);
  }

  if (isName(prop)) return fromName(prop);
  if (isMidi(prop)) return fromMidi(prop);
  if (isFrequency(prop)) return fromFrequency(prop);

  return EmptyNote;
}

/**
 * Note with methods factory function
 * @param {InitProp | NoteType } from
 * @param {NoteBuilderProps} initMethods
 * @return {Note}
 */

export function NoteMethods(initNote: InitProp | NoteType, initMethods?: NoteBuilderProps): Note {
  const { distance, transpose, compare } = { distance: true, transpose: true, compare: true, ...initMethods };

  const noteObj: NoteType = either(initNote, Note(initNote as InitProp), isObject(initNote));
  if (!noteObj.valid) return EmptyNote;

  const note = noteObj as NoteProps;

  const transposeMethods: NoteTransposeByFns = transpose && (TransposeMethods(true, note) as NoteTransposeByFns);
  const distanceMethods: NoteDistanceToFns = distance && (DistanceMethods(true, note) as NoteDistanceToFns);
  const compareMethods: NoteCompareToFns = compare && (CompareMethods(true, note) as NoteCompareToFns);

  return {
    ...note,
    ...transposeMethods,
    ...distanceMethods,
    ...compareMethods,
  };
}
