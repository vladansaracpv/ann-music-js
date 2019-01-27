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
  alteration: string;
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
export const ACCIDENTALS = 'b #'.split(' ');

/* All note names */
export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(
  ' '
);

/* Only sharp(#) notes */
export const SHARPS = ALL_NOTES.filter(x => x.includes('#'));

/* Only flat notes */
export const FLATS = ALL_NOTES.filter(x => x.includes('b'));

/* Only natural notes without accidentals */
export const NATURALS = ALL_NOTES.filter(x => x.length === 1);

/* Natural + sharp notes */
export const WITH_SHARPS = ALL_NOTES.filter(x => FLATS.indexOf(x) == -1);

/* Natural + flat notes */
export const WITH_FLATS = ALL_NOTES.filter(x => SHARPS.indexOf(x) == -1);

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
export const parse = (note = ''): any => {
  const props = REGEX.exec(note);
  if (!props || props[1] === '' || props[4] !== '') return undefined;

  return {
    letter: props[1].toUpperCase(),
    accidental: props[2].replace(/x/g, '##'),
    octave: props[3] ? Number.parseInt(props[3]) : 4,
    rest: props[4]
  };
};
