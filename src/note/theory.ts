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

const either = (truthy, falsy, condition) => condition ? truthy : falsy;
const naturals = (value: string, index: number) => either(index, null, value.length === 1);
const altered = (value: string, index: number) => either(index, null, value.length > 1);
const numbers = (value: any) => Number.isInteger(value);

/** Helper parser fn */
const capitalize = (l: string) => l.toUpperCase();
const substitute = (str: string, regex: RegExp, char: string) => str.replace(regex, char);
const parseOctave = (octave?: string) => octave ? +octave : 4;

export const LETTERS = 'CDEFGAB';
export const ACCIDENTALS = 'b#'.split('');

export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

export const WITH_SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');
export const WITH_FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');

export const NATURALS = LETTERS.split('');
export const SHARPS = WITH_SHARPS.filter(altered);
export const FLATS = WITH_FLATS.filter(altered);

export const WHITE_KEYS = WITH_SHARPS.map(naturals).filter(numbers);
export const BLACK_KEYS = WITH_SHARPS.map(altered).filter(numbers);

export const REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

/** Tokenize note given by string */
export const tokenize = (note: string) => {

  const [T_Letter, T_Accidental, T_Octave, T_Rest] = REGEX.exec(note).slice(1)
  if (!T_Letter || T_Rest) return undefined;

  return {
    letter: capitalize(T_Letter),
    accidental: substitute(T_Accidental, /x/g, '##'),
    octave: parseOctave(T_Octave),
    rest: T_Rest
  };
};
