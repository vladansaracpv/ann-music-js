import { tokenize, capitalize, substitute } from '../base/strings';
import { interval, segment, gt } from '../base/relations';
import { both } from '../base/boolean';
import { isInteger, isString, isNumber } from '../base/types';
import { ErrorCode, CustomError } from '../error/index';
import { curry } from '../base/functional';

/** Note Constants */
export const A_440 = 440.0;
export const MIDDLE_KEY = 69;
export const OCTAVE_RANGE = 12;
export const STANDARD_OCTAVE = 4;
export const NOTE_LETTERS = 'CDEFGAB';
export const NOTE_ACCIDENTALS = ['b', '#'];
export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');
export const WITH_SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');
export const WITH_FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');
export const NATURAL_NOTES = 'C D E F G A B'.split(' ');
export const SHARP_NOTES = 'C# D# F# G# A#'.split(' ');
export const FLAT_NOTES = 'Db Eb Gb Ab Bb'.split(' ');
export const NOTE_REGEX = /^(?<letter>[a-gA-G]?)(?<accidental>#{1,}|b{1,}|x{1,}|)(?<oct>-?\d*)\s*(?<rest>.*)$/;

interface NoteProps {
  name: string;
  letter: string;
  step: number;
  octave: number;
  accidental: string;
  alteration: number;
  pc: string;
  chroma: number;
  midi: number;
  frequency: number;
}

/** Validators */
export const Validate = {
  Name: (name: string): boolean => NOTE_REGEX.test(name) === true,
  Midi: (midi: number): boolean => both(isInteger(midi), interval(0, 128, midi)),
  Chroma: (chroma: number): boolean => both(isInteger(chroma), segment(0, 11, chroma)),
  Frequency: (freq: number): boolean => both(isNumber(freq), gt(freq, 0)),
};

/** Cleanup later */

const frequencyFromMidi = (key: number, tuning = A_440): number => tuning * 2 ** ((key - MIDDLE_KEY) / OCTAVE_RANGE);
const alterationValue = (accidental: string): number => {
  const len = accidental.length;
  return len * (accidental[0] === 'b' ? -1 : 1);
};
const letterStep = (letter: string): number => NOTE_LETTERS.indexOf(letter);
const letterIndex = letter => WITH_SHARPS.indexOf(letter);
const midiFromFreq = (freq, tuning = A_440) => Math.ceil(OCTAVE_RANGE * Math.log2(freq / tuning) + MIDDLE_KEY);
const parseOctave = (octave?: string) => (octave ? +octave : STANDARD_OCTAVE);

interface CacheObj {
  [key: string]: any;
}
const cache: CacheObj = {};

function getSetCache(name: string, properties: NoteProps) {
  return cache[name] || (cache[name] = properties);
}

/** Note Constructors */
export function createNoteFromName(name: string): NoteProps {
  const tokens = tokenize(name, NOTE_REGEX);

  if (!tokens || tokens.rest) return CustomError(ErrorCode.InvalidName, name);

  const { letter, accidental, oct, rest } = tokens;
  const step = letterStep(letter);
  const alteration = alterationValue(accidental);
  const offset = letterIndex(letter);
  const altered = offset + alteration;
  const alteredOct = Math.floor(altered / OCTAVE_RANGE);
  const octave = parseOctave(oct);
  const pc = letter + accidental;
  const chroma = alteredOct < 0 ? (altered - alteredOct * OCTAVE_RANGE) % OCTAVE_RANGE : altered % OCTAVE_RANGE;
  const midi = (octave + 1) * OCTAVE_RANGE + chroma;
  const frequency = frequencyFromMidi(midi);

  return {
    name: capitalize(name),
    letter: capitalize(letter),
    step,
    accidental: substitute(accidental, /x/g, '##'),
    alteration,
    octave,
    pc,
    chroma,
    midi,
    frequency,
  };
}

export function createNoteFromMidi(midi: number, useSharps = true) {
  if (!Validate.Midi(midi)) return CustomError(ErrorCode.InvalidMidi, midi);

  const octave = Math.floor(midi / OCTAVE_RANGE) - 1;
  const chroma = midi - OCTAVE_RANGE * (octave + 1);
  const frequency = frequencyFromMidi(midi);
  const pc = useSharps ? WITH_SHARPS[chroma] : WITH_FLATS[chroma];
  const name = pc + octave;
  const { letter, accidental } = tokenize(name, NOTE_REGEX);
  const alteration = alterationValue(accidental);
  const step = letterStep(letter);
  return {
    name,
    letter,
    step,
    accidental: substitute(accidental, /x/g, '##'),
    alteration,
    octave,
    pc,
    chroma,
    midi,
    frequency,
  };
}

export function createNoteFromFreq(freq: number, tuning = A_440) {
  const midi = midiFromFreq(freq, tuning);
  return createNoteFromMidi(midi);
}

/** Note functions */
export function simplifyNote(note: string, sameAccidental = true): string {
  const noteObj = createNoteFromName(note);
  if (!noteObj) return null;
  const { chroma, alteration, octave } = noteObj;

  const isSharp = alteration >= 0;

  const useSharps = (isSharp && sameAccidental) || (!isSharp && !sameAccidental);

  const pc = useSharps ? WITH_SHARPS[chroma] : WITH_FLATS[chroma];

  return pc + octave;
}

export const enharmonicNote = (note: string) => simplifyNote(note, false);

interface NoteInitProp {
  name?: string;
  midi?: number;
  frequency?: number;
}

/**
 * Construct Note from one of the fields (first valid): name | midi | frequency
 * @param note
 */
export function Note(note: NoteInitProp): NoteProps {
  if (!note) return CustomError(ErrorCode.EmptyConstructor, null);

  const { name, midi, frequency: freq } = note;
  let noteObj = {};

  if (name && Validate.Name(name)) noteObj = createNoteFromName(name);
  if (midi && Validate.Midi(midi)) noteObj = createNoteFromMidi(midi);
  if (freq && Validate.Frequency(freq)) noteObj = createNoteFromFreq(freq);

  if (noteObj['name']) return getSetCache(noteObj['name'], noteObj as NoteProps);

  return CustomError(ErrorCode.InvalidConstructor, JSON.stringify(note));
}

// Properties
const property = curry((name: string, note: NoteInitProp) => Note(note)[name]);

export const name = (note: NoteInitProp) => property('name', note);
export const octave = (note: NoteInitProp) => property('octave', note);
export const letter = (note: NoteInitProp) => property('letter', note);
export const step = (note: NoteInitProp) => property('step', note);
export const accidental = (note: NoteInitProp) => property('accidental', note);
export const alteration = (note: NoteInitProp) => property('alteration', note);
export const pc = (note: NoteInitProp) => property('pc', note);
export const chroma = (note: NoteInitProp) => property('chroma', note);
export const midi = (note: NoteInitProp) => property('midi', note);
export const frequency = (note: NoteInitProp) => property('frequency', note);
