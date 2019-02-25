import { compose, floor, subC, decrement, pow2, normalize, isString, isEmpty, isMadeOfChar } from '../helpers';
import { EMPTY_NOTE, parse, LETTERS, ALL_NOTES, WHITE_KEYS, WITH_SHARPS, WITH_FLATS, NO_NOTE } from './theory';

interface ACCIDENTAL_TYPE {
  value: string,
  type: string,
  alteration: number
};

interface PITCH_CLASS_TYPE {
  name: string,
  index: number
};

interface FREQUENCY_TYPE {
  value: number
}

interface PITCH_TYPE {
  name: string,
  index: number
};

interface BASIC_TONE_TYPE {
  tone: string,
  index: number,
  position: number,
  step: number
};

const ACCIDENTAL_FACTORY = {
  TYPES: 'b#'.split(''),
  VALUES: { 'b': -1, ' ': 0, '#': 1 },

  isValid: function (accident = '') {
    if (isEmpty(accident)) { return true; }
    if (!isMadeOfChar(accident)) { return false; }
    return '#b'.indexOf(accident[0]) > -1;
  },

  isSharp: function (accident) {
    return this.getType(accident) === '#';
  },

  isFlat: function (accident) {
    return this.getType(accident) === 'b';
  },

  isNatural: function (accident) {
    return this.getType(accident) === ' ';
  },

  getType: function (acc = ' ') {
    return this.isValid(acc) ? acc[0] : null;
  },

  getTypeValue: function (type = '') {
    return this.VALUES[type] || 0;
  },

  getOffset: function (accident = ' ') {
    if (!this.isValid(accident)) return null;
    return accident.length * this.getTypeValue(this.getType(accident));
  },

  create: function (acc: string): ACCIDENTAL_TYPE {
    if (!this.isValid(acc)) return null;
    return {
      value: acc,
      type: this.getType(acc),
      alteration: this.getOffset(acc)
    }
  }
};

const PITCH_CLASS_FACTORY = {
  CLASSES: {
    'FLAT': WITH_FLATS,
    'SHARP': WITH_SHARPS
  },

  isValid: function (pc: string) {
    return ALL_NOTES.indexOf(pc) > -1
      ? true
      : false
  },

  getChroma: function (letter, accidental) {
    return accidental === 'b'
      ? this.CLASSES.FLAT.indexOf(letter + accidental)
      : this.CLASSES.SHARP.indexOf(letter + accidental);
  },

  fromChroma: function (chroma: number, type: string) {
    return {
      name: this.CLASSES[type][chroma],
      index: chroma
    }
  },

  create: function (letter: string, accidental: string): PITCH_CLASS_TYPE {
    return {
      name: letter + accidental,
      index: this.getChroma(letter, accidental)
    };
  }
};

const FREQUENCY_FACTORY = {
  isValid: function (freq) {
    return typeof freq === 'number' && freq > 0;
  },

  fromMidi: function (midi, tuning = 440): FREQUENCY_TYPE {
    if (!Number.isInteger(midi)) return null;
    return { value: tuning * compose(pow2, normalize, subC(69))(midi) };
  }
}

const PITCH_FACTORY = {
  octaveSize: function (octave) {
    return 12 * ++octave;
  },

  octaveSpan: (midi: number) => compose(decrement, floor, normalize)(midi),

  getMidi: function (octave, chroma) {
    if (!Number.isInteger(octave) || !Number.isInteger(chroma)) return null;
    return this.octaveSize(octave) + chroma;
  },

  simplify: function (note: string, withSameAccidentals = true) {
    const tokens = parse(note);
    const { letter, accident, octave } = tokens;
    const offset = BASIC_TONE_FACTORY.naturalToneIndex(letter) % 12;
    const alteration = ACCIDENTAL_FACTORY.getOffset(accident);
    const chroma = (offset + alteration) % 12;

    const isSharp = ACCIDENTAL_FACTORY.isSharp(accident);
    const type = isSharp ? 'SHARP' : 'FLAT';
    const otherType = isSharp ? 'FLAT' : 'SHARP';

    const pc = withSameAccidentals
      ? PITCH_CLASS_FACTORY.fromChroma(chroma, type)
      : PITCH_CLASS_FACTORY.fromChroma(chroma, otherType);

    return this.create(pc, octave);
  },

  enharmonic: function (note: string) {
    return this.simplify(note, false);
  },

  create: function (pc, octave): PITCH_TYPE {
    return ({
      name: pc.name + octave,
      index: this.getMidi(octave, pc.index)
    });
  }
}

const BASIC_TONE_FACTORY = {
  whiteKeyIndex: function (tone: string) { return LETTERS.indexOf(tone); },
  naturalToneIndex: function (tone: string) { return WHITE_KEYS[this.whiteKeyIndex(tone)]; },

  create: function (letter) {
    return {
      tone: letter,
      index: this.whiteKeyIndex(letter),
      position: this.naturalToneIndex(letter),
      step: this.whiteKeyIndex(letter) + 1
    }
  }
}

export const getNoteProps = (noteName: string): any => {
  const tokens = parse(noteName);
  if (!tokens) { return EMPTY_NOTE; }
  const { letter, accident, octave } = tokens;
  const natural = BASIC_TONE_FACTORY.create(letter);
  const accidental = ACCIDENTAL_FACTORY.create(accident);
  const pc = PITCH_CLASS_FACTORY.create(letter, accidental.type);
  const pitch = PITCH_FACTORY.create(pc, octave);
  const frequency = FREQUENCY_FACTORY.fromMidi(pitch.index);

  return {
    frequency,
    letter,
    octave,
    natural,
    accidental,
    pc,
    pitch,
  };
};

const cache = {} as { [key: string]: any };

export const properties = (str?: string) => {
  if (!isString(str)) return NO_NOTE;
  return cache[str] || (cache[str] = getNoteProps(str));
};

console.log(getNoteProps('G#4'));


// // Properties
// export const property = curry((name: string, note: string) => getNoteProps(note)[name]);
// export const frequency = (note: string) => property('frequency', note);
// export const letter = (note: string) => property('letter', note);
// export const octave = (note: string) => property('octave', note);
// export const natural = (note: string) => property('natural', note);
// export const accidental = (note: string) => property('accidental', note);
// export const pc = (note: string) => property('pc', note);
// export const pitch = (note: string) => property('pitch', note);

// // Subtypes
// export const alteration = (note: string) => accidental(note).alteration;
// // export const pc = (note: string) => pc(note).class;
// export const chroma = (note: string) => pc(note).index;
// export const name = (note: string) => pitch(note).name;
// export const midi = (note: string) => pitch(note).index;


