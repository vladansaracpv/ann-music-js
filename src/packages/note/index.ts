import { tokenize, capitalize, substitute } from '../../base/strings';
import { interval, segment, gt, lt } from '../../base/relations';
import { and2 } from '../../base/logical';
import { modC, mul2, sub2, inc, add2 } from '../../base/math';
import { either } from '../../base/boolean';
import { isInteger, isNumber } from '../../base/types';
import { ErrorCode, CustomError } from '../../error/index';

/** Note name is made from letter + accidental? + octave */
type NoteName = string;

/** Set of characteds used for note naming */
type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/** Note step represents index of NoteLetter. It starts from 'C' at index 0 */
type NoteStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Octave is integer value. Human ear can differ from 0 to 10, which is inside theoretical range of 20Hz-20KHz   */
type NoteOctave = number;

/** Accidental is a string consisting of one or more '#' or 'b', or neutral - '' */
type NoteAccidental = string;

/** Alteration is numerical value of NoteAccidental where each '#' adds 1, and 'b' adds -1 */
type NoteAlteration = number;

/** There are 12 different pitches in an octave, each at distance of 1 halfstep. C, C#, D, ...B */
type NotePC = string;

/** Chroma is numerical value of a NotePC. Starting at 0: 'C', and ending at 11: 'B' */
type NoteChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** Midi value represents NoteChroma that is extended with octave. */
type NoteMidi = number;

/** Positive number. Represents tone frequency */
type NoteFreq = number;

type OrNull<T> = T | null;

type NoteProp =
  | NoteName
  | NoteLetter
  | NoteStep
  | NoteOctave
  | NoteAccidental
  | NoteAlteration
  | NotePC
  | NoteChroma
  | NoteMidi
  | NoteFreq;

/** Interfaces */
interface NoteProps {
  name: NoteName;
  letter: NoteLetter;
  step: NoteStep;
  octave: NoteOctave;
  accidental: NoteAccidental;
  alteration: NoteAlteration;
  pc: NotePC;
  chroma: NoteChroma;
  midi: NoteMidi;
  frequency: NoteFreq;
}

interface CacheObj {
  [key: string]: any;
}

export interface NoteInitProp {
  name?: string;
  midi?: number;
  frequency?: number;
}

/** Note Constants */

/** Standard tuning frequency */
export const A_440 = 440.0;

/** Midi value for central key used for tuning */
export const MIDDLE_KEY = 69;

/** Number of tones in octave */
export const OCTAVE_RANGE = 12;

/** Default octave value */
export const STANDARD_OCTAVE = 4;

/** Letters used for note naming */
export const NOTE_LETTERS = 'CDEFGAB';

/** Accidental types for flat/sharp note */
export const NOTE_ACCIDENTALS = ['b', '#'];

/** Note names. and2 flats and sharps */
export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

/** Chromatic octave with sharps as accidentals */
export const WITH_SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');

/** Chromatic octave with flats as accidentals */
export const WITH_FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');

/** Natural (white keys) notes. Without accidentals */
export const NATURAL_NOTES = 'C D E F G A B'.split(' ');

/** Sharp notes isolated */
export const SHARP_NOTES = 'C# D# F# G# A#'.split(' ');

/** Flat notes isolated */
export const FLAT_NOTES = 'Db Eb Gb Ab Bb'.split(' ');

/** Regular expression used to tokenize note name to letter, accidental & octave */
export const NOTE_REGEX = /^(?<letter>[a-gA-G]?)(?<accidental>#{1,}|b{1,}|x{1,}|)(?<oct>-?\d*)\s*(?<rest>.*)$/;

/** Validators */
export const Validator = {
  Name: (name: string): boolean => NOTE_REGEX.test(name) === true,
  Midi: (midi: number): boolean => and2(isInteger(midi), interval(0, 128, midi)),
  Chroma: (chroma: number): boolean => and2(isInteger(chroma), segment(0, 11, chroma)),
  Frequency: (freq: number): boolean => and2(isNumber(freq), gt(freq, 0)),
};

/** Cleanup later */
const Midi = {
  toFrequency(key: number, tuning = A_440): NoteFreq {
    return tuning * 2 ** ((key - MIDDLE_KEY) / OCTAVE_RANGE);
  },
};

const Frequency = {
  toMidi(freq, tuning = A_440) {
    return Math.ceil(OCTAVE_RANGE * Math.log2(freq / tuning) + MIDDLE_KEY);
  },
};

const Accidental = {
  value(accidental: string): number {
    const len = accidental.length;
    return len * (accidental[0] === 'b' ? -1 : 1);
  },
};

const Letter = {
  step(letter: string): number {
    return (letter.charCodeAt(0) + 3) % 7;
  },
  index(letter: string) {
    return WITH_SHARPS.indexOf(letter);
  },
};

const Octave = {
  parse(octave?: string): NoteOctave {
    return octave ? +octave : STANDARD_OCTAVE;
  },
};

let cache: CacheObj;

function getSetCache(name: string, properties: NoteProps) {
  return cache[name] || (cache[name] = properties);
}

/**
 * Note Constructors. We can calculate Note object from:
 * - NoteName
 * - NoteMidi
 * - NoteFreq
 */
export function createNoteFromName(name: NoteName): NoteProps {
  const tokens = tokenize(name, NOTE_REGEX);

  if (!tokens || tokens['rest']) return null;
  // CustomError(ErrorCode.InvalidName, name);

  const { letter, accidental, oct, rest } = tokens;
  const step = Letter.step(letter) as NoteStep;
  const alteration = Accidental.value(accidental) as NoteAlteration;
  const offset = Letter.index(letter);
  const altered = offset + alteration;
  const alteredOct = Math.floor(altered / OCTAVE_RANGE);
  const octave = Octave.parse(oct) as NoteOctave;
  const pc = (letter + accidental) as NotePC;
  const chroma = either(
    (altered - alteredOct * OCTAVE_RANGE) % OCTAVE_RANGE,
    altered % OCTAVE_RANGE,
    lt(alteredOct, 0),
  ) as NoteChroma;
  const midi = (inc(octave) * OCTAVE_RANGE + chroma) as NoteMidi;
  const frequency = Midi.toFrequency(midi) as NoteFreq;

  return Object.freeze({
    name: capitalize(name) as NoteName,
    letter: capitalize(letter) as NoteLetter,
    step,
    accidental: substitute(accidental, /x/g, '##') as NoteAccidental,
    alteration,
    octave,
    pc,
    chroma,
    midi,
    frequency,
  });
}

export function createNoteFromMidi(midi: number, useSharps = true): NoteProps {
  if (!Validator.Midi(midi)) return CustomError(ErrorCode.InvalidMidi, midi);

  const octave = (Math.floor(midi / OCTAVE_RANGE) - 1) as NoteOctave;
  const chroma = (midi - OCTAVE_RANGE * (octave + 1)) as NoteChroma;
  const frequency = Midi.toFrequency(midi) as NoteFreq;
  const pc = either(WITH_SHARPS[chroma], WITH_FLATS[chroma], useSharps) as NotePC;
  const name: NoteName = pc + octave;
  const tokens = tokenize(name, NOTE_REGEX);
  const letter = tokens['letter'] as NoteLetter;
  const accidental = tokens['accidental'] as NoteAccidental;
  const alteration = Accidental.value(accidental) as NoteAlteration;
  const step = Letter.step(letter) as NoteStep;

  return Object.freeze({
    name,
    letter,
    step,
    accidental: substitute(accidental, /x/g, '##') as NoteAccidental,
    alteration,
    octave,
    pc,
    chroma,
    midi,
    frequency,
  });
}

export function createNoteFromFreq(freq: number, tuning = A_440): NoteProps {
  const midi = Frequency.toMidi(freq, tuning);
  return createNoteFromMidi(midi);
}

/** Note functions */
export function simplifyNote(note: string, sameAccidental = true): NoteName {
  const noteObj = createNoteFromName(note);
  if (!noteObj) return null;
  const { chroma, alteration, octave } = noteObj;

  const isSharp = alteration >= 0;

  const useSharps = (isSharp && sameAccidental) || (!isSharp && !sameAccidental);

  const pc = useSharps ? WITH_SHARPS[chroma] : WITH_FLATS[chroma];

  return pc + octave;
}

export const enharmonicNote = (note: string): NoteName => simplifyNote(note, false);

/**
 * Construct Note from one of the fields (first valid): name | midi | frequency
 * @param note
 */
export function Note(note: NoteInitProp): NoteProps {
  if (!note) return CustomError(ErrorCode.EmptyConstructor, null);

  const { name, midi, frequency } = note;
  let noteObj: NoteProps;

  if (name && Validator.Name(name)) return createNoteFromName(name);
  if (midi && Validator.Midi(midi)) return createNoteFromMidi(midi);
  if (frequency && Validator.Frequency(frequency)) return createNoteFromFreq(frequency);

  // if (noteObj['name']) return getSetCache(name, noteObj as NoteProps);
  return null;
  // return CustomError(ErrorCode.InvalidConstructor, JSON.stringify(note));
}

// Properties
const property = (name: string, note: NoteInitProp): NoteProp => Note(note) && Note(note)[name];

export const name = (note: NoteInitProp): NoteName => property('name', note) as NoteName;
export const octave = (note: NoteInitProp): NoteOctave => property('octave', note) as NoteOctave;
export const letter = (note: NoteInitProp): NoteLetter => property('letter', note) as NoteLetter;
export const step = (note: NoteInitProp): NoteStep => property('step', note) as NoteStep;
export const accidental = (note: NoteInitProp): NoteAccidental => property('accidental', note) as NoteAccidental;
export const alteration = (note: NoteInitProp): NoteAlteration => property('alteration', note) as NoteAlteration;
export const pc = (note: NoteInitProp): NotePC => property('pc', note) as NotePC;
export const chroma = (note: NoteInitProp): NoteChroma => property('chroma', note) as NoteChroma;
export const midi = (note: NoteInitProp): NoteMidi => property('midi', note) as NoteMidi;
export const frequency = (note: NoteInitProp): NoteFreq => property('frequency', note) as NoteFreq;
