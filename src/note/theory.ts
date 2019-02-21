
interface NoteProps {
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

/** Helper methods for Note types*/
const contains = (char: string) => str => str.includes(char);
const isChar = (str: string) => str.length === 1;
const notFlat = (note: string) => FLATS.indexOf(note) < 0;
const notSharp = (note: string) => SHARPS.indexOf(note) < 0;

/** Helper parser fn */
const capitalize = (l: string) => l.toUpperCase();
const substitute = (str: string, regex: RegExp, char: string) => str.replace(regex, char);
const parseOctave = (octave?: string) => octave ? +octave : 4;

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

export const NO_NOTE = Object.freeze(EMPTY_NOTE);

export const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
export const LETTERS = 'CDEFGAB';
export const WHITES = [0, 2, 4, 5, 7, 9, 11];
export const ACCIDENTALS = ['b', '#'];
export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');


/** Note types */
export const SHARPS = ALL_NOTES.filter(contains('#'));
export const FLATS = ALL_NOTES.filter(contains('b'));
export const NATURALS = ALL_NOTES.filter(isChar);
export const WITH_SHARPS = ALL_NOTES.filter(notFlat);
export const WITH_FLATS = ALL_NOTES.filter(notSharp);



/** Tokenize note given by string */
export const parse = (note: string) => {

  const [T_Letter, T_Accidental, T_Octave, T_Rest] = REGEX.exec(note).slice(1)
  if (!T_Letter || T_Rest) return undefined;

  const [letter, accidental, octave, rest] = [
    capitalize(T_Letter),
    substitute(T_Accidental, /x/g, '##'),
    parseOctave(T_Octave),
    T_Rest
  ];

  return { letter, accidental, octave, rest }
};
