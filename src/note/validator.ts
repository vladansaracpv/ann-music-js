import { KEYS, LETTERS, parse } from './theory';
import {
  isMemberOf,
  isInteger,
  isNumber,
  andN,
  isBetween,
  isEmpty,
  isMadeOfChar,
  gt
} from '../helpers';

/** 
 * Valid key is from the KEYS array 
 *  
 * @param key - key to be checked
 * 
 */
const allTrue = andN;
const isKey = (key: string): boolean => isMemberOf(KEYS, key);

/** Valid octave is integer */
const isOctave = (octave: number): boolean => isInteger(+octave);

/** Valid letter is from the LETTERS string */
const isLetter = (letter: string): boolean => isMemberOf(LETTERS, letter);

/** Valid step is an integer from [0,6] */
const isStep = (step: number): boolean => allTrue(isInteger(step), isBetween(0, 6, step));

/** Valid alteration value is represented by integer */
const isAlteration = (alteration: number): boolean => isInteger(alteration);

/** Valid chroma value is integer from [0, 11] */
const isChroma = (chroma: number): boolean => allTrue(isInteger(chroma), isBetween(0, 11, chroma));

/** Valid midi is integer */
const isMidi = (midi: number): boolean => isInteger(midi);

/** Valid frequency is positive number */
const isFrequency = (freq: number): boolean => allTrue(isNumber(freq), gt(0, freq));

/** Valid name contains valid {letter, accident, octave} */
const isName = (name: string): boolean => {

  const tokens = parse(name);
  if (!tokens) return false;

  const { letter, accidental, octave, ...rest } = tokens;

  return allTrue(isLetter(letter), isAccidental(accidental), isOctave(octave));
};

/** Valid accident is either '' or multiple of #/b */
const isAccidental = (accident: string): boolean => {
  // '' is valid accident value
  if (isEmpty(accident)) { return true; }

  // '#' or 'bbb' are valid, but '#b' is not
  if (!isMadeOfChar(accident)) { return false; }

  return '#b'.indexOf(accident[0]) > -1;
};

/** Valid pc is made up from valid {letter, accident} */
const isPc = (pc: string): boolean => {
  return pc.length === 1
    ? isLetter(pc)
    : allTrue(isLetter(pc[0]), isAccidental(pc[1]));
};

export {
  isKey,
  isName,
  isLetter,
  isAccidental,
  isAlteration,
  isOctave,
  isPc,
  isStep,
  isChroma,
  isMidi,
  isFrequency
};
