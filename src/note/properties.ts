import { error } from '../error';
import { compose, curry } from '../helpers';
import { KEYS, LETTERS, SEMI, SHARPS, FLATS, REGEX } from './theory';
import { Validator } from './validator';
import { transposeBy } from './transpose';


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

export const isCharRepeated = (str: string, chr: string): boolean => {
  const len = str.length;
  return str === chr.repeat(len);
};

/**
 *  Calculate note's frequency from note's MIDI number.
 *
 *  @function
 *
 *  @param {number} midi            MIDI value.
 *  @param {number} [tuning = 440]  Tuning to be used.
 *
 *  @return {number}                Frequency for given @midi number.
 *
 */
export const midiToFreq = (midi: number, tuning: number = 440): number => {
  return 2 ** ((midi - 69) / 12) * tuning;
};


/**
 *  Calculate note's MIDI number from note's frequency.
 *
 *  @function
 *
 *  @param {number} freq            Note frequency.
 *  @param {number} [tuning = 440]  Tuning to be used.
 *
 *  @return {number}                MIDI number for given @freq value.
 *
 */
export const freqToMidi = (freq: number, tuning: number = 440): number => {

  if (!Validator.isFrequency(freq)) return undefined;

  return Math.ceil(12 * Math.log2(freq / tuning) + 69);

};


/**
 *  Calculate Note.name from @pc and @octave
 *
 *  @function
 *
 *  @param {string} pc            Note' pitch class.
 *  @param {number} [octave]      Octave if provided.
 *
 *  @return {string}              Note.name
 *
 */
export const setName = (pc: string, octave?: string): string => {
  return pc + (octave ? Number.parseInt(octave) : '');
};


/**
 *  Calculate Note.letter
 *
 *  @function
 *
 *  @param {string} letter        Note' pitch class.
 *
 *  @return {string}              Note.letter
 *
 */
export const setLetter = (letter: string): string => letter.toUpperCase();


/**
 *  Calculate Note.pc from @letter and @accidental
 *
 *  @function
 *
 *  @param {string} letter        Note letter
 *  @param {string} [accidentals] Note accidental
 *
 *  @return {string}              Note.pc
 *
 */
export const setPc = (letter: string, accidentals?: string): string => {
  return letter.toUpperCase() + (accidentals || '');
};


/**
 *  Calculate Note.octave from @octave string.
 *
 *  @function
 *
 *  @param {string} octave        Note octave string
 *
 *  @return {number}              Note.octave
 *
 */
export const setOctave = (octave: string): number => {
  if (!octave) return undefined;
  return Number.parseInt(octave);
};


/**
 *  Calculate Note.step from @letter
 *
 *  @function
 *
 *  @param {string} letter        Note letter
 *
 *  @return {number}              Note.step
 *
 */
export const setStep = (letter: string): number => {
  if (!Validator.isLetter(letter)) return undefined;
  return LETTERS.indexOf(letter);
};


/**
 *  Calculate Note.step from @letter
 *
 *  @function
 *
 *  @param {string} accidental    Note accidental
 *
 *  @return {number}              Note.alteration
 *
 */
export const setAlteration = (accidental: string): number => {
  if (!Validator.isAccidental(accidental)) return undefined;
  if (accidental.length ===0) return 0;
  return accidental[0] === '#'
         ? accidental.length
         : accidental.length;
};


/**
 *  Calculate Note.chroma value
 *
 *  @function
 *
 *  @param {number} step          Note accidental
 *  @param {number} alteration    Note.alteration
 *
 *  @return {number}              Note.chroma
 *
 */
export const setChroma = (step: number, alteration: number): number => {
  return (SEMI[step] + alteration + 120) % 12;
};


/**
 *  Calculate Note.midi value
 *
 *  @function
 *
 *  @param {number} octave        Note octave
 *  @param {number} step          Note.step
 *
 *  @return {number}              Note.midi
 *
 */
export const setMidi = (octave: number, step: number, alteration: number): number => {

  if (!octave) return undefined;
  return SEMI[step] + alteration + 12 * (octave + 1);

};


/**
 *  Calculate Note.frequency
 *
 *  @function
 *
 *  @param {number} midi        Note midi
 *
 *  @return {number}            Note frequency
 *
 */
export const setFrequency = (midi: number): number => {
  return midi ? midiToFreq(midi) : undefined;
};


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
export const parse = (note: string = ''): any => {

  const props = REGEX.exec(note);
  if (!props) return undefined;
  return {
    letter: props[1].toUpperCase(),
    accidental: props[2].replace(/x/g, '##'),
    octave: props[3],
    rest: props[4]
  };
};


/**
 *  Create note object by parsing note string
 *
 *  @function
 *
 *  @param {string} note        Note string
 *
 *  @return {object}            Note object
 *
 */
export const NOTE = (name): any => {

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


/**
 *  Create note object by parsing note string
 *
 *  @function
 *
 *  @param {string} property    Note property
 *  @param {string} note        Note string
 *
 *  @return {any}               Note property
 *
 */
export const property = curry((name, note) => NOTE(note)[name]);

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


/**
 *  Create note object from midi value
 *
 *  @function
 *
 *  @param {number} midiValue         Note midi value
 *  @param {boolean} [sharps = true]   Should the note be created with sharps
 *
 *  @return {any}                     Note object
 *
 */
export const fromMidi = (midiValue: number, sharps: boolean = true): any => {
  const midi = Math.round(midiValue);
  const pcs = sharps === true ? SHARPS : FLATS;
  const pc = pcs[midi % 12];
  const o = Math.floor(midi / 12) - 1;
  return pc + o;
};


/**
 *  Create note object from frequency value
 *
 *  @function
 *
 *  @param {number} freq         Note frequency
 *  @param {boolean} [sharps = true]   Should the note be created with sharps
 *
 *  @return {any}                     Note object
 *
 */
export const fromFreq = (freq: number, sharps: boolean = true): any => {
  return compose(fromMidi, freqToMidi)(freq, sharps);
};


/**
 *  Return note in simplified notation if possible.
 *
 *  @function
 *
 *  @param {string}  note               Note frequency
 *  @param {boolean} [sameAcc = true]   Should the note be created with sharps
 *
 *  @return {any}                       Note object
 *
 */
export const simplify = (note: string, sameAcc: boolean = true): any => {

  const ifMidi = Validator.isMidi(property('midi', note));

  const nameFromMidi = compose(fromMidi, property('midi'))(note);
  const nameFromPc = compose(property('pc'), fromMidi, property('chroma'))(note);

  const either = (f, g, c) => c ? f : g;

  return either(nameFromMidi, nameFromPc, ifMidi);

};


/**
 *  Return enharmonic note of given note
 *
 *  @function
 *
 *  @param {string}  note               Note string
 *
 *  @return {string}                    Note object
 *
 */
export const enharmonic = (note: string): string => simplify(note, false);

