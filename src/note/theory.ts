
// Note properties
export const KEYS = [
  'name',
  'letter',
  'accidental',
  'octave',
  'pc',
  'step',
  'alteration',
  'chroma',
  'midi',
  'frequency'
];
// Regular expression for parsing notes. Note => [letter, accidental, octave, rest]
export const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

// Letters used for tone note names
export const LETTERS = 'CDEFGAB';

// Accidentals symbols. # - sharps, b - flats
export const ACCIDENTALS = '# b'.split(' ');

// All note names. Both sharps and flats
export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

// Only sharp notes
export const SHARPS_ONLY = ALL_NOTES.filter(x => x.includes('#'));

// Only flat notes
export const FLATS_ONLY = ALL_NOTES.filter(x => x.includes('b'));

// Only natural notes (without sharps or flats)
export const NATURALS_ONLY = ALL_NOTES.filter(x => x.length === 1);

// Natural + Sharps
export const SHARPS = ALL_NOTES.filter(x => FLATS_ONLY.indexOf(x) === -1);

// Natural + Flats
export const FLATS = ALL_NOTES.filter(x => SHARPS_ONLY.indexOf(x) === -1);

// Natural notes positions in C chromatic scale
export const SEMI = [0, 2, 4, 5, 7, 9, 11];
