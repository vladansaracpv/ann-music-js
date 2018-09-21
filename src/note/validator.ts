import { LETTERS, REGEX, KEYS } from '../note/theory';

export namespace Validator {

  export const madeOfChar = el => el[0].repeat(el.length) === el;
  export const isMember = (X: string | string[], k) => !isEmpty(k) && X.indexOf(k) > -1;
  export const inside = (a, b, x) => a <= x && x <= b;
  export const isInt = x => Number.isInteger(x);
  export const isNum = x => typeof(x) === 'number';
  export const isEmpty = x => x.length === 0;
  export const rest = (x, n = 1) => x.substring(n, x.length - 1);
  export const allTrue = (...args) => args.reduce((acc, x) => acc && x);

  // Function to parse note from note string
  export const parseNote = (note = '') => {

    const props = REGEX.exec(note);
    if (!props) return undefined;
    return {
      letter: props[1].toUpperCase(),
      accidental: props[2].replace(/x/g, '##'),
      octave: props[3] && isInt(props[3]) ? isInt(props[3]) : 4,
      rest: props[4]
    };
  };

  export const isKey = key => isMember(KEYS, key);


  export const isName = (name) => {
    const { letter, accidental, octave, rest } = parseNote(name);
    return allTrue(isLetter(letter), isAccidental(accidental), isOctave(octave));
  };


  export const isLetter = letter => isMember(LETTERS, letter);


  export const isAccidental = (accidental) => {
    if (isEmpty(accidental)) return true;
    if (!madeOfChar(accidental)) return false;
    return '#b'.indexOf(accidental[0]) > -1;
  };


  export const isOctave = octave => isInt(octave);


  export const isPc = (pc) => {

    if (pc.length === 1) return isLetter(pc);

    return isLetter(pc[0]) && isAccidental(rest(pc));
  };


  export const isStep = step => isInt(step) && inside(0, 6, step);


  export const isAlteration = alteration => isInt(alteration);


  export const isChroma = chroma => isInt(chroma) && inside(0, 11, chroma);


  export const isMidi = midi => isInt(midi);


  export const isFrequency = freq => isNum(freq);

  // const a = parseNote('C#4');
}
// console.log(Validator.isName('V#'));
