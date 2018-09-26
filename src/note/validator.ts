import { Theory } from './theory';
import {
  isMember,
  isInt,
  isNum,
  allTrue,
  inside,
  rest,
  isEmpty,
  madeOfChar
}
from '../helpers';

export class Validator {

  static isKey = key => isMember(Theory.KEYS, key);
  static isName = (name) => {
    const tokens = Theory.parse(name);
    if (!tokens) return false;
    const { letter, accidental, octave, rest } = tokens;
    return allTrue(Validator.isLetter(letter), Validator.isAccidental(accidental), Validator.isOctave(octave));
  };
  static isLetter = letter => isMember(Theory.LETTERS, letter);
  static isAccidental = (accidental) => {
    if (isEmpty(accidental)) return true;
    if (!madeOfChar(accidental)) return false;
    return '#b'.indexOf(accidental[0]) > -1;
  };
  static isOctave = octave => allTrue(!isEmpty(octave), isInt(+octave));
  static isPc = pc => pc.length === 1 ? Validator.isLetter(pc) : allTrue(Validator.isLetter(pc[0]), Validator.isAccidental(rest(pc)));
  static isStep = step => isInt(step) && inside(0, 6, step);
  static isAlteration = alteration => isInt(alteration);
  static isChroma = chroma => isInt(chroma) && inside(0, 11, chroma);
  static isMidi = midi => isInt(midi);
  static isFrequency = freq => isNum(freq);
  
}
