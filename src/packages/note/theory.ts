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

/**
 * Standard tuning frequency (Tone A4) from which we derive other tones/frequencies
 */
export const A_440 = 440.0;

/**
 * Midi value of A4.
 * We can use this to find out all the other midi keys easily
 */
export const A4_KEY = 69;

/**
 * Number of tones in octave
 */
export const OCT_RANGE = 12;

/**
 * Default octave value used if no octave given
 */
export const OCTAVE = 4;

/**
 * Letters used for note naming.
 */
export const LETTERS = 'CDEFGAB';

/**
 * Accidental types for flat/sharp note
 */
export const ACCIDENTALS = ['b', '#'];

/**
 * All pitch (classes) in standard use
 */
export const NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

/**
 * Function to extract note types from @NOTES
 * @param acc {string}
 */
export const notes = acc => NOTES.filter(note => acc.indexOf(note[1] || ' ') >= 0);

/**
 * 12 standard pitch classes with # used for black keys
 */
export const SHARPS = notes('# ');

/**
 * 12 standard pitch classes with b used for black keys
 */
export const FLATS = notes('b ');

/**
 * Only the white keys (natural notes)
 */
export const NATURAL = notes(' ');

/**
 * Only black keys (sharps)
 */
export const SHARP = notes('#');

/**
 * Only black keys (flats)
 */
export const FLAT = notes('b');

/**
 * Indexes of white keys in 12-note octave
 */
export const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];

/**
 * Indexes of black keys in 12-note octave
 */
export const BLACK_KEYS = [1, 3, 4, 8, 10];

/**
 * Regular expression used to tokenize @NoteName
 * It returns {letter, accidental, octave, duration and "rest"}
 *
 * Groups:
 * 1) Capturing @NoteLetter
 *    (?<Tletter>[a-gA-G])
 *
 * 2) @NoteAccidental - On or more (exclusively) #, b or x (= ##)
 *    (?<Taccidental>#{1,}|b{1,}|x{1,}|)
 *
 * 3) Optional number for octave. Default is @OCTAVE
 *    (?<Toct>-?\d*)
 *
 * 4) Optional note duration value @NoteDuration
 *    (?<Tduration>(\/(1|2|4|8|16|32|64))?)
 *
 * 5) Collecting whitespace and part not being parsed (can be used to check for errors)
 *    \s*(?<Trest>.*)
 */
export const REGEX = /^(?<Tletter>[a-gA-G])(?<Taccidental>#{1,}|b{1,}|x{1,}|)(?<Toct>-?\d*)(?<Tduration>(\/(1|2|4|8|16|32|64))?)\s*(?<Trest>.*)$/;

// export const EmptyNote: NoteProps = {
//   name: '',
//   letter: undefined,
//   step: undefined,
//   octave: undefined,
//   accidental: undefined,
//   alteration: undefined,
//   pc: undefined,
//   chroma: undefined,
//   midi: undefined,
//   frequency: undefined,
//   color: undefined,
//   valid: false,
// };

export const EmptyNote: NoNote = {
  name: '',
  valid: false,
};
