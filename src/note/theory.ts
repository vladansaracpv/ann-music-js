
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

/** Helper parser fn */
const capitalize = (l: string) => l.toUpperCase();
const substitute = (str: string, regex: RegExp, char: string) => str.replace(regex, char);
const parseOctave = (octave?: string) => octave ? +octave : 4;
const tokenize = (str: string, regex: string | RegExp) => str.match(regex) ? str.match(regex)['groups'] : null;

export const OCTAVE_SIZE = 12;

export const LETTERS = 'CDEFGAB';
export const ACCIDENTALS = 'b#'.split('');

export const ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

export const NATURALS = LETTERS.split('');
export const SHARPS = 'C# D# F# G# A#'.split(' ');
export const FLATS = 'Db Eb Gb Ab Bb'.split(' ');

export const WITH_SHARPS = 'C C# D D# E F F# G G# A A# B'.split(' ');
export const WITH_FLATS = 'C Db D Eb E F Gb G Ab A Bb B'.split(' ');

export const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];
export const BLACK_KEYS = [1, 3, 6, 8, 10];

export const REGEX = /^(?<letter>[a-gA-G]?)(?<accidental>#{1,}|b{1,}|x{1,}|)(?<octave>-?\d*)\s*(?<rest>.*)$/;


/** Tokenize note given by string */
export const parseNote = (note: string) => {

  const { letter, accidental, octave, rest } = tokenize(note, REGEX);
  if (!letter || rest) return null;

  return {
    letter: capitalize(letter),
    accidental: substitute(accidental, /x/g, '##'),
    octave: parseOctave(octave),
  };

};
