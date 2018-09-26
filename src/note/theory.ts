
export class Theory {

  // Note properties
  static KEYS = [
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

  static EMPTY_NOTE = {
    name: undefined,
    letter: undefined,
    accidental: undefined,
    octave: undefined,
    pc: undefined,
    step: undefined,
    alteration: undefined,
    chroma: undefined,
    midi: undefined,
    frequency: undefined
  };

  static NO_NOTE = Object.freeze({
    name: undefined,
    letter: undefined,
    accidental: undefined,
    octave: undefined,
    pc: undefined,
    step: undefined,
    alteration: undefined,
    chroma: undefined,
    midi: undefined,
    frequency: undefined
  });

  // Regular expression for parsing notes. Note => [letter, accidental, octave, rest]
  static REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

  // Letters used for tone note names
  static LETTERS = 'CDEFGAB';

  // Accidentals symbols. # - sharps, b - flats
  static ACCIDENTALS = '# b'.split(' ');

  // All note names. Both sharps and flats
  static ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

  // Only sharp notes
  static SHARPS_ONLY = Theory.ALL_NOTES.filter(x => x.includes('#'));

  // Only flat notes
  static FLATS_ONLY = Theory.ALL_NOTES.filter(x => x.includes('b'));

  // Only natural notes (without sharps or flats)
  static NATURALS_ONLY = Theory.ALL_NOTES.filter(x => x.length === 1);

  // Natural + Sharps
  static SHARPS = Theory.ALL_NOTES.filter(x => Theory.FLATS_ONLY.indexOf(x) === -1);

  // Natural + Flats
  static FLATS = Theory.ALL_NOTES.filter(x => Theory.SHARPS_ONLY.indexOf(x) === -1);

  // Natural notes positions in C chromatic scale
  static SEMI = [0, 2, 4, 5, 7, 9, 11];


  /**
   *  Parse note from string
   *
   *  @function
   *
   *  @param {string} note        Note string
   *
   *  @return {object}            Object of { letter, accidental, octave, rest }
   *
   */
  static parse = (note = ''): any => {

    const props = Theory.REGEX.exec(note);
    if (!props || props[4] !== '') return undefined;
    return {
      letter: props[1].toUpperCase(),
      accidental: props[2].replace(/x/g, '##'),
      octave: props[3],
      rest: props[4]
    };
  };

}
