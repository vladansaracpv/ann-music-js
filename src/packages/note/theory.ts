/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              NOTE - THEORY CONSTANTS                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

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

/** Chromatic octave with sharps as accidentals **/
export const SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');

/** Hromatic octave with flats as accidentals **/
export const FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');

/** Natural (white keys) notes. Without accidentals **/
export const NATURAL = 'C D E F G A B'.split(' ');

/** Sharp notes isolated **/
export const SHARP = 'C# D# F# G# A#'.split(' ');

/** Flat notes isolated **/
export const FLAT = 'Db Eb Gb Ab Bb'.split(' ');

/** Regular expression used to tokenize NoteName to {letter, accidental, octave} **/
export const NOTE_REGEX = /^(?<Tletter>[a-gA-G]?)(?<Taccidental>#{1,}|b{1,}|x{1,}|)(?<Toct>-?\d*)\s*(?<Trest>.*)$/;
