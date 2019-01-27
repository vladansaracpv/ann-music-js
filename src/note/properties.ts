import { curry, glue } from '../helpers';
import { EMPTY_NOTE, parse, LETTERS, WHITES } from './theory';
import { FREQUENCY } from './factories/frequency';
import { NAME } from './factories/name';
import { LETTER } from './factories/letter';
import { ACCIDENTAL } from './factories/accidental';

/**
 *  Create note object by parsing note string
 *
 *  @function
 *
 *  @param  {string} note   Note string
 *
 *  @return {object}        Note object
 *
 */
export const props = (noteName): any => {
  const tokens = parse(noteName);
  if (!tokens) return EMPTY_NOTE;

  const { letter, accidental, octave } = tokens;

  /**
   *  Pitch Class (pc) is made from
   *  - @letter (C, D, E.., B)
   *  - @accidental ('#', 'bb', '')
   *
   *  Example: C#, Gb, F##
   */
  const pc = glue(letter, accidental);

  /**
   *  Note name is pitch class with octave
   *
   *  Example: C#4, Gb3, F##5
   */
  const name = glue(pc, octave);

  /**
   *  Note step is index of it's letter, starting from 0 (C)
   *
   *  Example: C(0), F(3)...
   */
  const step = LETTERS.indexOf(letter);

  /**
   *  Note alteration is integer value of accidental value
   *  - # = +1
   *  - b = -1
   *
   *  Example: ## = 2, bb = -2
   */
  const accl = accidental.length;
  const alteration = accidental.indexOf('b') ? accl : -accl;

  /**
   *  Note chroma value is index of it's PC starting from 0 (C),
   *
   *  Example: C#: 1, F#/Gb: 6
   */
  const chroma = Math.abs(WHITES[step] + alteration) % 12;

  /**
   *  Note midi value is it's unique index used in midi devices
   *
   *  Example: C4: 60, C-1: 0, D#2: 39
   */
  const midi = WHITES[step] + alteration + 12 * (octave + 1);

  /**
   *  Note frequency
   */
  const frequency = midi ? FREQUENCY.fromMidi(midi) : undefined;

  return {
    ...EMPTY_NOTE,
    name,
    letter,
    step,
    accidental,
    alteration,
    octave,
    pc,
    chroma,
    midi,
    frequency,
    enharmonic: '',
    oct: octave,
    alt: alteration
  };
};

/**
 *  Return property @name of @note
 *
 *  @function
 *
 *  @param  {string} name   Name of the property
 *  @param  {string} note   Note string
 *
 *  @return {any}           Note property
 *
 */
export const property = curry((name, note) => props(note)[name]);

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
export const simplify = (note: string, withSameAccidentals = true): any => {
  /** Try to get midi value */
  const midi = property('midi', note);

  /** Should the same accidentals be used */
  const alteration = property('alteration', note);
  const hasSharps = alteration > 0;
  const useSharps = withSameAccidentals ? hasSharps : !hasSharps;

  return NAME.fromMidi(midi, useSharps);
};

/**
 *  Return enharmonic note of given note
 *
 *  @function
 *
 *  @param  {string}  note       Note string
 *
 *  @return {string}            Note object
 *
 */
export const enharmonic = (note: string): string => simplify(note, false);

// Getters for note properties
export const name = note => props(note).name;
export const letter = note => props(note).letter;
export const step = note => props(note).step;
export const accidental = note => props(note).accidental;
export const alteration = note => props(note).alteration;
export const octave = note => props(note).octave;
export const pc = note => props(note).pc;
export const chroma = note => props(note).chroma;
export const midi = note => props(note).midi;
export const frequency = note => props(note).frequency;

export const from = (fromProps = {}, baseNote = null) => {
  const { step, alt, oct } = baseNote
    ? Object.assign({}, props(baseNote), fromProps)
    : fromProps;
  if (typeof step !== 'number') return null;
  // if (typeof alt !== "number") return null
  const letter = LETTER.fromStep(step);
  if (!letter) return null;
  const pc = letter + ACCIDENTAL.fromAlt(alt);
  return oct || oct === 0 ? pc + oct : pc;
};

/**
 * Deprecated. This is kept for backwards compatibility only.
 * Use Note.from instead
 */
export const build = from;
