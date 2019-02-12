import { curry, glue, either } from '../helpers';
import { EMPTY_NOTE, parseNote, LETTERS, WHITES, WITH_SHARPS, WITH_FLATS } from './theory';

/**
 *  Create note object by parsing note string
 *
 *  @param  note Note string
 *
 *  @return Note object
 *
 */

const getStepForLetter = (allLetters, letter) => allLetters.indexOf(letter);
const getAccidentalValue = accidental => accidental[0] === 'b' ? -accidental.length : accidental.length;
const getChroma = (keys, step, alteration) => (keys[step] + alteration + 12) % 12;
const getPc = (noteLetter, accidental) => glue(noteLetter, accidental);
const getName = (pc, octave) => glue(pc, octave);
const getMidi = (chroma, octave) => chroma + 12 * (octave + 1);
const getFreqFromMidi = (midi, tuning = 440) => 2 ** ((midi - 69) / 12) * tuning;
const getNameFromMidi = (midi, sharps, flats, useSharps = true) => {
  const index = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const pc = either(sharps[index], flats[index], useSharps);
  return pc + octave;
};
const getNameFromStep = (step, allLetters) => allLetters[step];
const getAccidentalFromValue = alteration => (alteration < 0 ? 'b'.repeat(-alteration) : '#'.repeat(alteration));

export const getNoteProps = (noteName): any => {
  const tokens = parseNote(noteName);
  if (!tokens) { return EMPTY_NOTE; }

  const { letter, accidental, octave } = tokens;

  /**
   *  Note step is index of it's letter, starting from 0 (C)
   *
   *  Example: C(0), F(3)...
   */
  const step = getStepForLetter(LETTERS, letter);

  /**
   *  Note alteration is integer value of accidental value
   *  - # = +1
   *  - b = -1
   *
   *  Example: ## = 2, bb = -2
   */
  const alteration = getAccidentalValue(accidental);

  /**
   *  Note chroma value is index of it's PC starting from 0 (C),
   *
   *  Example: C#: 1, F#/Gb: 6
   */
  const chroma = getChroma(WHITES, step, alteration);

  /**
   *  Pitch Class (pc) is made from
   *  - @letter (C, D, E.., B)
   *  - @accidental ('#', 'bb', '')
   *
   *  Example: C#, Gb, F##
   */
  const pc = getPc(letter, accidental);
  // const pc = alteration >= 0 ? WITH_SHARPS[chroma] : WITH_FLATS[chroma]

  /**
   *  Note name is pitch class with octave
   *
   *  Example: C#4, Gb3, F##5
   */
  const name = getName(pc, octave);

  /**
   *  Note midi value is it's unique index used in midi devices
   *
   *  Example: C4: 60, C-1: 0, D#2: 39
   */
  const midi = getMidi(chroma, octave);

  /**
   *  Note frequency
   */
  const frequency = midi ? getFreqFromMidi(midi) : undefined;

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
  };
};

/**
 *  Return property @name of @note
 *
 *  @param  name   Name of the property
 *  @param  note   Note string
 *
 *  @return Note property
 *
 */
export const property = curry((name, note) => getNoteProps(note)[name]);

/**
 *  Return note in simplified notation if possible.
 *
 *  @param note               Note frequency
 *  @param sameAcc = true   Should the note be created with sharps
 *
 *  @return Note object
 *
 */

export const simplify = (note: string, withSameAccidentals = true): any => {
  /** Try to get midi value */
  const midi = property('midi', note);

  /** Should the same accidentals be used */
  const alteration = property('alteration', note);
  const hasSharps = alteration >= 0;
  const useSharps = withSameAccidentals ? hasSharps : !hasSharps;

  return getNameFromMidi(midi, WITH_SHARPS, WITH_FLATS, useSharps);
};

/**
 *  Return enharmonic note of given note
 *
 *  @param  note Note string
 *
 *  @return Note object
 *
 */
export const enharmonic = (note: string): string => simplify(note, false);

// Getters for note properties
export const name = note => getNoteProps(note).name;
export const letter = note => getNoteProps(note).letter;
export const step = note => getNoteProps(note).step;
export const accidental = note => getNoteProps(note).accidental;
export const alteration = note => getNoteProps(note).alteration;
export const octave = note => getNoteProps(note).octave;
export const pc = note => getNoteProps(note).pc;
export const chroma = note => getNoteProps(note).chroma;
export const midi = note => getNoteProps(note).midi;
export const frequency = note => getNoteProps(note).frequency;



export const from = (fromProps = {}, baseNote = null) => {
  const { step, alt, oct } = baseNote
    ? Object.assign({}, getNoteProps(baseNote), fromProps)
    : fromProps;
  console.log(step, alt, oct);
  if (typeof step !== 'number') { return null; }
  // if (typeof alt !== "number") return null
  const letter = getNameFromStep(step, WHITES);
  if (!letter) { return null; }
  const pc = letter + getAccidentalFromValue(alt);
  return oct || oct === 0 ? pc + oct : pc;
};

/**
 * Deprecated. This is kept for backwards compatibility only.
 * Use Note.from instead
 */
export const build = from;
