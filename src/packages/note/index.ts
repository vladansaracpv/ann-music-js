import { tokenize, capitalize, substitute } from '../../base/strings';
import { interval, segment, gt, lt } from '../../base/relations';
import { and2 } from '../../base/logical';
import { inc, dec } from '../../base/math';
import { either } from '../../base/boolean';
import { isInteger, isNumber, isString } from '../../base/types';
import { CustomError } from '../../error/index';
import { pipe } from '../../base/functional';

const NoteError = CustomError('Note');

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  NOTE - INTERFACES                      *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/**
 * Note name is made from letter + accidental? + octave
 */
type NoteName = string;

/**
 * Set of characteds used for note naming
 */
type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/**
 * Note step represents index of NoteLetter.
 * It starts from 'C' at index 0
 */
type NoteStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Octave is integer value.
 * Human ear can differ from 0 to 10, which is inside theoretical range of 20Hz-20KHz
 */
type NoteOctave = number;

/**
 * Accidental is a string consisting of one or more '#' or 'b', or neutral - ''
 */
type NoteAccidental = string;

/**
 * Alteration is numerical value of NoteAccidental where each '#' adds 1, and 'b' adds -1
 */
type NoteAlteration = number;

/**
 * There are 12 different pitches in an octave, each at distance of 1 halfstep. C, C#, D, ...B
 */
type NotePC = string;

/**
 * Chroma is numerical value of a NotePC. Starting at 0: 'C', and ending at 11: 'B'
 */
type NoteChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * Midi value represents NoteChroma that is extended with octave.
 */
type NoteMidi = number;

/**
 * Positive number. Represents tone frequency
 */
type NoteFreq = number;

/**
 * Note property is either of previous types
 */
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

/**
 * Note properties from which the Note object can be constructed
 */
type InitProps = Pick<NoteProps, 'name' | 'midi' | 'frequency'>;

/**
 * Note object factory accepts one of InitProps types
 */
type NoteInitProp = Partial<InitProps>;

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              NOTE - THEORY CONSTANTS                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** Standard tuning frequency **/
export const A_440 = 440.0;

/** Midi value for central key used for tuning */
export const MIDDLE_KEY = 69;

/** Number of tones in octave **/
export const OCTAVE_RANGE = 12;

/** Default octave value **/
export const STANDARD_OCTAVE = 4;

/** Letters used for note naming **/
export const NOTE_LETTERS = 'CDEFGAB';

/** Accidental types for flat/sharp note **/
export const NOTE_ACCIDENTALS = ['b', '#'];

/** Note names. Both flats and sharps **/
export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

/** Chromatic octave with sharps as accidentals */
export const SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');

/** Hromatic octave with flats as accidentals */
export const FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');

/** Natural (white keys) notes. Without accidentals */
export const NATURAL = 'C D E F G A B'.split(' ');

/** Sharp notes isolated **/
export const SHARP = 'C# D# F# G# A#'.split(' ');

/** Flat notes isolated **/
export const FLAT = 'Db Eb Gb Ab Bb'.split(' ');

/**
 * Regular expression used to tokenize NoteName to {letter, accidental, octave}
 */
export const NOTE_REGEX = /^(?<Tletter>[a-gA-G]?)(?<Taccidental>#{1,}|b{1,}|x{1,}|)(?<Toct>-?\d*)\s*(?<Trest>.*)$/;

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              NOTE PROPS - VALIDATORS                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export const Validators = {
  name: (name: string): boolean => NOTE_REGEX.test(name) === true,
  midi: (midi: number): boolean => and2(isInteger(midi), interval(0, 128, midi)),
  chroma: (chroma: number): boolean => and2(isInteger(chroma), segment(0, 11, chroma)),
  frequency: (freq: number): boolean => and2(isNumber(freq), gt(freq, 0)),
};

const isValid = (property: string) => value => either(Validators[property](value), false, Validators[property]);

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              NOTE PROPS - HELPER FUNCTIONS              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
const Midi = {
  toFrequency: (key: NoteMidi, tuning = A_440): NoteFreq => tuning * 2 ** ((key - MIDDLE_KEY) / OCTAVE_RANGE),
};

const Frequency = {
  toMidi: (freq: NoteFreq, tuning = A_440) => Math.ceil(OCTAVE_RANGE * Math.log2(freq / tuning) + MIDDLE_KEY),
};

const Accidental = {
  toAlteration: (accidental: NoteAccidental): number => accidental.length * (accidental[0] === 'b' ? -1 : 1),
};

const Letter = {
  stepOf: (letter: NoteLetter): number => (letter.charCodeAt(0) + 3) % 7,
  indexOf: (letter: NoteLetter) => SHARPS.indexOf(letter),
};

const Octave = {
  parse: (octave?: string): NoteOctave => either(+octave, STANDARD_OCTAVE, isString(octave)),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              NOTE FACTORIES                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export function noteFromName(note: NoteName): NoteProps {
  const tokens = tokenize(note, NOTE_REGEX);

  if (!tokens || tokens['Trest']) return NoteError('InvalidName', note);

  let { Tletter, Taccidental, Toct } = tokens;

  const letter = capitalize(Tletter) as NoteLetter;
  const step = Letter.stepOf(letter) as NoteStep;

  const accidental = substitute(Taccidental, /x/g, '##') as NoteAccidental;
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

  // Offset (number of keys) from first letter - C
  const offset = Letter.indexOf(letter);

  // Note position is calculated as: offset from the start + in place alteration
  const altered = offset + alteration;

  // Because of the alteration, note can slip into the previous/next octave
  const alteredOct = Math.floor(altered / OCTAVE_RANGE);

  const octave = Octave.parse(Toct) as NoteOctave;
  const name = capitalize(note) as NoteName;

  const pc = (letter + accidental) as NotePC;

  /**
   *  @example
   *  Chroma of Cb != 0. Enharmonic note for Cb == B so the chroma == 11
   *  altered == -1
   *  alteredOct == -1
   */
  const chroma = either(
    (altered - alteredOct * OCTAVE_RANGE) % OCTAVE_RANGE,
    altered % OCTAVE_RANGE,
    lt(alteredOct, 0),
  ) as NoteChroma;

  const midi = (inc(octave) * OCTAVE_RANGE + chroma) as NoteMidi;
  const frequency = Midi.toFrequency(midi) as NoteFreq;

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
  });
}

export function noteFromMidi(midi: NoteMidi, useSharps = true): NoteProps {
  if (!isValid('midi')(midi)) return NoteError('InvalidMidi', midi);

  const frequency = Midi.toFrequency(midi) as NoteFreq;
  const octave = dec(Math.floor(midi / OCTAVE_RANGE)) as NoteOctave;

  const chroma = (midi - OCTAVE_RANGE * inc(octave)) as NoteChroma;
  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps) as NotePC;

  const name: NoteName = pc + octave;

  const tokens = tokenize(name, NOTE_REGEX);

  const letter = tokens['Tletter'] as NoteLetter;
  const step = Letter.stepOf(letter) as NoteStep;

  const accidental = substitute(tokens['Taccidental'], /x/g, '##') as NoteAccidental;
  const alteration = Accidental.toAlteration(accidental) as NoteAlteration;

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
  });
}

export function noteFromFreq(freq: NoteFreq, tuning = A_440): NoteProps {
  if (!isValid('frequency')(freq)) return NoteError('InvalidFrequency', freq);

  return pipe(
    Frequency.toMidi,
    noteFromMidi,
  )(freq, tuning);
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                NOTE - FUNCTIONS                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export function simplify(note: NoteName, sameAccidental = true): NoteName {
  const noteObj = noteFromName(note);

  if (!noteObj) return null;

  const { chroma, alteration, octave } = noteObj;

  const isSharp = alteration >= 0;

  const useSharps = (isSharp && sameAccidental) || (!isSharp && !sameAccidental);

  const pc = either(SHARPS[chroma], FLATS[chroma], useSharps);

  return pc + octave;
}

export function enharmonic(note: NoteName): NoteName {
  return simplify(note, false);
}

export function Note(note: NoteInitProp): NoteProps {
  if (!note) return NoteError('EmptyConstructor', null);

  const { name, midi, frequency } = note;

  if (name && isValid('name')(name)) return noteFromName(name);

  if (midi && isValid('midi')(midi)) return noteFromMidi(midi);

  if (frequency && isValid('frequency')(frequency)) return noteFromFreq(frequency);

  return NoteError('InvalidConstructor', JSON.stringify(note));
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * *              NOTE PROPS - GETTERS                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
function property(name: string, note: NoteName): NoteProp {
  return Note({ name: note }) && Note({ name: note })[name];
}

export const name = (note: NoteName): NoteName => property('name', note) as NoteName;

export const octave = (note: NoteName): NoteOctave => property('octave', note) as NoteOctave;

export const letter = (note: NoteName): NoteLetter => property('letter', note) as NoteLetter;

export const step = (note: NoteName): NoteStep => property('step', note) as NoteStep;

export const accidental = (note: NoteName): NoteAccidental => property('accidental', note) as NoteAccidental;

export const alteration = (note: NoteName): NoteAlteration => property('alteration', note) as NoteAlteration;

export const pc = (note: NoteName): NotePC => property('pc', note) as NotePC;

export const chroma = (note: NoteName): NoteChroma => property('chroma', note) as NoteChroma;

export const midi = (note: NoteName): NoteMidi => property('midi', note) as NoteMidi;

export const frequency = (note: NoteName): NoteFreq => property('frequency', note) as NoteFreq;
