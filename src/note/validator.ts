import { KEYS, LETTERS, parse } from './theory';
import {
  memberOf,
  isInt,
  isNum,
  allTrue,
  inside,
  isEmpty,
  madeOfChar,
  firstLetter
} from '../helpers';

/* Valid key is from the KEYS array */
const isKey = key => memberOf(KEYS, key);

/* Valid name contains valid {letter, accidental, octave} */
const isName = name => {
  const tokens = parse(name);
  if (!tokens) { return false; }

  const { letter, accidental, octave, rest } = tokens;

  return allTrue(isLetter(letter), isAccidental(accidental), isOctave(octave));
};

/* Valid letter is from the LETTERS string */
const isLetter = letter => memberOf(LETTERS, letter);

/* Valid accidental is either '' or multiple of #/b */
const isAccidental = accidental => {
  if (isEmpty(accidental)) { return true; }
  if (!madeOfChar(accidental)) { return false; }
  return '#b'.indexOf(firstLetter(accidental)) > -1;
};

/* Valid octave is integer */
const isOctave = octave => allTrue(!isEmpty(octave), isInt(+octave));

/* Valid pc is made up from valid {letter, accidental} */
const isPc = pc => {
  if (pc.length === 1) { return isLetter(pc); }
  return allTrue(isLetter(pc[0]), isAccidental(pc.substring(1)));
};

/* Valid step is an integer from [0,6] */
const isStep = step => allTrue(isInt(step), inside(0, 6, step));

/* Valid alteration value is represented by integer */
const isAlteration = alteration => isInt(alteration);

/* Valid chroma value is integer from [0, 11] */
const isChroma = chroma => isInt(chroma) && inside(0, 11, chroma);

/* Valid midi is integer */
const isMidi = midi => isInt(midi);

/* Valid frequency is positive number */
const isFrequency = freq => allTrue(isNum(freq), freq > 0);

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
