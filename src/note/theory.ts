/* Note properties */
export const KEYS = [
  'name',
  'letter',
  'step',
  'accidental',
  'alteration',
  'octave',
  'pc',
  'chroma',
  'midi',
  'frequency'
];

type NoteProps = {
  name: string;
  letter: string;
  step: number;
  accidental: string;
  alteration: number;
  octave: number;
  pc: string;
  chroma: number;
  midi: number;
  frequency: number;
};

/* CONSTANT for empty note */
export const EMPTY_NOTE = {
  name: undefined,
  letter: undefined,
  step: undefined,
  accidental: undefined,
  alteration: undefined,
  octave: undefined,
  pc: undefined,
  chroma: undefined,
  midi: undefined,
  frequency: undefined
};

/* CONSTANT (immutable) for empty note */
export const NO_NOTE = Object.freeze(EMPTY_NOTE);

/**
 *  Regular expression for parsing notes.
 *  Note => [letter, accidental, octave, rest]
 */
export const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

/* Letters used for tone note names */
export const LETTERS = 'CDEFGAB';

/* Accidentals symbols: sharps(#), flats(b) */
export const ACCIDENTALS = ['b', '#'];

/* All note names */
export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(
  ' '
);

const contains = char => str => str.includes(char);
/* Only sharp(#) notes */
export const SHARPS = ALL_NOTES.filter(contains('#'));

/* Only flat notes */
export const FLATS = ALL_NOTES.filter(contains('b'));

/* Only natural notes without accidentals */
const isChar = (str) => str.length === 1;
export const NATURALS = ALL_NOTES.filter(isChar);

/* Natural + sharp notes */
const notFlat = (note) => FLATS.indexOf(note) < 0;
export const WITH_SHARPS = ALL_NOTES.filter(notFlat);

/* Natural + flat notes */
const notSharp = note => SHARPS.indexOf(note) < 0;
export const WITH_FLATS = ALL_NOTES.filter(notSharp);

/* Natural notes positions in C chromatic scale (white keys) */
export const WHITES = [0, 2, 4, 5, 7, 9, 11];

/**
 *  Parse note from string
 *
 *  @function
 *
 *  @param  {string} note  Note string
 *
 *  @return {object}       { letter, accidental, octave, rest }
 *
 */
export const parseNote = (note = ''): any => {
  const props = REGEX.exec(note);
  if (!props || props[1] === '' || props[4] !== '') return undefined;

  return {
    letter: props[1].toUpperCase(),
    accidental: props[2].replace(/x/g, '##'),
    octave: props[3] ? Number.parseInt(props[3]) : 4,
    rest: props[4]
  };
};
