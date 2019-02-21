import { LETTERS } from '../theory';
import { compose, curry } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { isLetter } from '../validator';
import { PC } from '../factories/pc';
import { MIDI } from '../factories/midi';

export class LETTER {
  static fromLetter = letter => letter;
  static fromStep = step => LETTERS[step];
  static fromName = name => name[0];
  static fromPc = pc => pc[0];
  static fromChroma = chroma => compose(LETTER.fromPc, PC.fromChroma)(chroma);
  static fromFreq = freq => compose(LETTER.fromMidi, MIDI.fromFreq)(freq);
  static fromMidi = midi => LETTER.fromChroma(midi % 12);
  static fromAcc = acc => ERROR.NO_FACTORY('letter', 'accidental', acc);
  static fromAlt = alt => ERROR.NO_FACTORY('letter', 'alteration', alt);
  static fromOct = oct => ERROR.NO_FACTORY('letter', 'octave', oct);
}

const FROM = {
  letter: LETTER.fromLetter,
  name: LETTER.fromName,
  pc: LETTER.fromPc,
  step: LETTER.fromStep,
  chroma: LETTER.fromChroma,
  midi: LETTER.fromMidi,
  frequency: LETTER.fromFreq,
  accidental: LETTER.fromAcc,
  alteration: LETTER.fromAlt,
  octave: LETTER.fromOct
};

export const LETTER_FACTORY = curry((prop, withValue) => {
  const letter = FROM[prop](withValue);
  if (!letter) return undefined;
  return isLetter(letter) ? letter : undefined;
});
