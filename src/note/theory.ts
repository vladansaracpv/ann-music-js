export class Theory {
  /** Note properties */
  static PROPERTIES = [
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

  static EMPTY_NOTE = {
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

  static NO_NOTE = Object.freeze({
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
  });

  /**
   * Regular expression for parsing notes.
   * Note => [letter, accidental, octave, rest]
   */
  static REGEX = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;

  /**
   *   Letters used for tone note names
   */
  static LETTERS = 'CDEFGAB';

  /**
   *  Accidentals symbols.
   *  # - sharps
   *  b - flats
   */
  static ACCIDENTALS = '# b'.split(' ');

  /**
   *  All note names
   */
  static ALL_NOTES = 'C C# Db D D# Eb E F F# Gb G G# Ab A A# Bb B'.split(' ');

  /**
   *  Only sharp(#) notes
   */
  static SHARPS = Theory.ALL_NOTES.filter(x => x.includes('#'));

  /**
   *  Only flat notes
   */
  static FLATS = Theory.ALL_NOTES.filter(x => x.includes('b'));

  /**
   *  Only natural notes without accidentals
   */
  static NATURAL = Theory.ALL_NOTES.filter(x => x.length === 1);

  /**
   *  Natural + sharp notes
   */
  static WITH_SHARPS = Theory.ALL_NOTES.filter(x => Theory.FLATS.indexOf(x) == -1);

  /**
   *  Natural + flat notes
   */
  static WITH_FLATS = Theory.ALL_NOTES.filter(x => Theory.SHARPS.indexOf(x) == -1);

  /**
   *  Natural notes positions in C chromatic scale (white keys)
   */
  static WHITES = [0, 2, 4, 5, 7, 9, 11];

  /**
   *  Parse note from string
   *
   *  @function
   *
   *  @param  {string} note       Note string
   *
   *  @return {object}          { letter, accidental, octave, rest }
   *
   */
  static parse = (note = ''): any => {
    const props = Theory.REGEX.exec(note);
    if (!props || props[1] === '' || props[4] !== '') return undefined;
    return {
      letter: props[1].toUpperCase(),
      accidental: props[2].replace(/x/g, '##'),
      octave: props[3] ? Number.parseInt(props[3]) : 4,
      rest: props[4]
    };
  };
}
