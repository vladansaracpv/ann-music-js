/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                 NOTE - THEORY CONSTANTS                 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** Note keys */
export const KEYS = [
  'name',
  'letter',
  'step',
  'octave',
  'accidental',
  'alteration',
  'pc',
  'chroma',
  'midi',
  'frequency',
  'color',
  'valid',
];

/** Standard tuning frequency **/
export const A_440 = 440.0;

/** Midi value for central key used for tuning **/
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

// console.log(ALL_NOTES);
export const notes = acc => ALL_NOTES.filter(note => acc.indexOf(note[1] || ' ') >= 0);

/** Chromatic octave with sharps as accidentals **/
export const SHARPS = notes('# ');

/** Hromatic octave with flats as accidentals **/
export const FLATS = notes('b ');

/** Natural (white keys) notes. Without accidentals **/
export const NATURAL = notes(' ');

/** Sharp notes isolated **/
export const SHARP = notes('#');

/** Flat notes isolated **/
export const FLAT = notes('b');

/** Indexes of white keys in 12-step octave */
export const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];

/** Indexes of black keys in 12-step octave */
export const BLACK_KEYS = [1, 3, 4, 8, 10];

/** Regular expression used to tokenize NoteName to {letter, accidental, octave} **/
export const NOTE_REGEX = /^(?<Tletter>[a-gA-G])(?<Taccidental>#{1,}|b{1,}|x{1,}|)(?<Toct>-?\d*)\s*(?<Trest>.*)$/;
