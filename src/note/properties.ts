import { error } from '../error';
import { compose } from '../helpers';
import { KEYS, LETTERS, SEMI, SHARPS, FLATS, REGEX } from './theory';
import { Validator } from './validator';
import { transposeBy } from './transpose';



// Empty note object
export const EMPTY_NOTE = {
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

// Empty note immutable type
export const NO_NOTE = Object.freeze({
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

// Helper functions
export const isCharRepeated = (str: string, chr: string): boolean => {
  const len = str.length;
  return str === chr.repeat(len);
};

export const midiToFreq = (midi: number, tuning = 440): number => {
  return 2 ** ((midi - 69) / 12) * tuning;
};

export const freqToMidi = (freq, tuning = 440) => {

  if (!Validator.isFrequency(freq)) return undefined;

  return Math.ceil(12 * Math.log2(freq / tuning) + 69);

};

// Build note properties
export const setName = (pc: string, octave?: string) => {
  return pc + octave ? Number.parseInt(octave) : '';
};

export const setLetter = (letter: string) => letter.toUpperCase();

export const setPc = (letter: string, accidentals?: string): string => {
  return letter.toUpperCase() + (accidentals || '');
};

export const setOctave = (octave: string) => {
  if (!octave) return undefined;
  return Number.parseInt(octave);
};

export const setStep = (letter: string) => {
  if (!Validator.isLetter(letter)) return undefined;
  return LETTERS.indexOf(letter);
};

export const setAlteration = (accidental: string): number => {
  if (!Validator.isAccidental(accidental)) return undefined;
  return accidental[0] === '#'
         ? accidental.length
         : -accidental.length;
};

export const setChroma = (step: number, alteration: number) => {
  return (SEMI[step] + alteration + 120) % 12;
};

export const setMidi = (octave: number, step: number, alteration: number) => {

  if (!octave) return undefined;
  return SEMI[step] + alteration + 12 * (octave + 1);

};

export const setFrequency = (midi: number): number => {
  return midi ? midiToFreq(midi) : undefined;
};

// Function to parse note from note string
export const parse = (note = '') => {

  const props = REGEX.exec(note);
  if (!props) return undefined;
  return {
    letter: props[1].toUpperCase(),
    accidental: props[2].replace(/x/g, '##'),
    octave: props[3],
    rest: props[4]
  };
};

// Create note from note string
export const NOTE = (name) => {
  // if (!name) return _name => NOTE(_name);
  const { letter, accidental, octave, rest } = parse(name);
  if (letter === '' || rest !== '') return EMPTY_NOTE;
  const note = EMPTY_NOTE;
  note.letter = setLetter(letter);
  note.accidental = accidental;
  note.octave = setOctave(octave);
  note.pc = setPc(note.letter, note.accidental);
  note.name = setName(note.pc, note.octave);
  note.step = setStep(note.letter);
  note.alteration = setAlteration(note.accidental);
  note.chroma = setChroma(note.step, note.alteration);
  note.midi = setMidi(note.octave, note.step, note.alteration);
  note.frequency = setFrequency(note.midi);

  return note;
};

// Get single note property from note name
export const property = (name = '', note = '') => {

  if (name + note === '') {
    return error('NO_PARAMS_ERROR', {
      name,
      note
    });
  }

  if (name === '') return name => property(name, note);

  if (note === '') return note => property(name, note);

  if (!KEYS.indexOf(name)) {
    return error('UNDEFINED_PROPERTY', {
      name,
      note
    });
  }

  return NOTE(note)[name];
};

// // Getters for note properties
// export const name = note => NOTE(note).name;
// export const letter = note => NOTE(note).letter;
// export const accidental = note => NOTE(note).accidental;
// export const octave = note => NOTE(note).octave;
// export const pc = note => NOTE(note).pc;
// export const step = note => NOTE(note).step;
// export const alteration = note => NOTE(note).alteration;
// export const chroma = note => NOTE(note).chroma;
// export const midi = note => NOTE(note).midi;
// export const frequency = note => NOTE(note).frequency;

// Get note from midi value
export const fromMidi = (num, sharps = true) => {
  const midi = Math.round(num);
  const pcs = sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
};

export const fromFreq = (num, sharps = true) => {
  return compose(fromMidi, freqToMidi)(num, sharps);
};

// Simplify note. Ex: C### = D#
export const simplify = (note, sameAcc = true) => {
  const _note = NOTE(note);
  const alteration = _note.alteration;
  const chroma = _note.chroma;
  const midi = _note.midi;
  const name = _note.name;

  if (chroma === undefined) return name(note);
  const useSharps = sameAcc === false ? alteration < 0 : alteration > 0;
  const pc = property('pc');
  return !midi ? pc(fromMidi(chroma, useSharps)) : fromMidi(midi, useSharps);
};

export const enharmonic = note => simplify(note, false);



export const noteFactory = () => {
  const factoryMethods = {
    midi: (num, sharps?) => NOTE(fromMidi(num, sharps)),
    name: NOTE,
    frequency: (num, sharps?) => NOTE(fromFreq(num, sharps))
  };

  const noteFrom = (type?, value?) => {
    if (!type) return factoryMethods;
    if (typeof type !== 'string') return undefined;

    return value ? factoryMethods[type](value) : factoryMethods[type];
  };

  const commands = {
    from: noteFrom,
    with: noteFrom
  };

  return commands;
};

export const create = (what?) => {
  const factoryMethods = {
    note: noteFactory()
  };
  if (!what) return factoryMethods;

  return factoryMethods[what];
};

export const transpose = (note, amount) => {
  const midi = property('midi', note);
  const pc = property('pc');
  if (midi) return compose(fromMidi)(midi + amount);
  const chroma = property('chroma', note);
  return compose(
    pc,
    fromMidi
  )(chroma);
};

// let fromName = create("note").from("frequency")(220);
// console.log(transposeBy('C4', '2 h'));
