import { Theory } from './theory';
import {
  isMember,
  isInt,
  isNum,
  allTrue,
  inside,
  isEmpty,
  madeOfChar,
  firstLetter
} from '../helpers';

export class Validator {

  /** Valid key is from the PROPERTIES array */
  static isKey = key => isMember(Theory.PROPERTIES, key);


  /** 
   *  Valid name contains valid:
   *  - Letter
   *  - Accidental
   *  - Octave
   */
  static isName = name => {

    const tokens = Theory.parse(name);
    if (!tokens) return false;
    
    const { letter, accidental, octave, rest } = tokens;
    return allTrue(
      Validator.isLetter(letter),
      Validator.isAccidental(accidental),
      Validator.isOctave(octave)
    );
  };


  /** Valid letter is from the LETTERS string */
  static isLetter = letter => isMember(Theory.LETTERS, letter);


  /** 
   *  Valid accidental is either:
   *  - Empty string: ''
   *  - Made only from one or more '#' or 'b'
   */
  static isAccidental = accidental => {
    if (isEmpty(accidental)) return true;
    if (!madeOfChar(accidental)) return false;
    return '#b'.indexOf(firstLetter(accidental)) > -1;
  };
  

  /** Valid octave is integer */
  static isOctave = octave => allTrue(!isEmpty(octave), isInt(+octave));
    

  /** 
   *  Valid Pitch Class is made up from valid:
   *  - Letter
   *  - Accidental
   */
  static isPc = pc => {
    if(pc.length === 1) return Validator.isLetter(pc);
    return allTrue(
      Validator.isLetter(pc[0]),
      Validator.isAccidental(pc.substring(1))
    );
  };
  
  
  /** Valid step is an integer from [0,6] */
  static isStep = step => allTrue(isInt(step), inside(0, 6, step));
  

  /** Valid alteration value is represented by integer */
  static isAlteration = alteration => isInt(alteration);
  

  /** Valid chroma value is integer from [0, 11] */
  static isChroma = chroma => isInt(chroma) && inside(0, 11, chroma);
  

  /** Valid midi is integer */
  static isMidi = midi => isInt(midi);
  

  /** Valid frequency is positive number */
  static isFrequency = freq => allTrue(isNum(freq), freq > 0);

}
