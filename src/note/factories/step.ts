import { LETTERS } from '../theory';
import { compose, curry, charAt } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { isStep } from '../validator';
import { PC } from '../factories/pc';
import { MIDI } from '../factories/midi';

export class STEP {
  static fromLetter = letter => LETTERS.indexOf(letter);
  static fromStep = step => LETTERS[step];
  static fromName = name => compose(STEP.fromLetter, charAt(0))(name);
  static fromPc = pc => compose(STEP.fromLetter, charAt(0))(pc);
  static fromChroma = chroma => compose(STEP.fromPc, PC.fromChroma)(chroma);
  static fromFreq = freq => compose(STEP.fromMidi, MIDI.fromFreq)(freq);
  static fromMidi = midi => STEP.fromChroma(midi % 12);
  static fromAcc = acc => ERROR.NO_FACTORY('step', 'accidental', acc);
  static fromAlt = alt => ERROR.NO_FACTORY('step', 'alteration', alt);
  static fromOct = oct => ERROR.NO_FACTORY('step', 'octave', oct);
}

const FROM = {
  letter: STEP.fromLetter,
  name: STEP.fromName,
  pc: STEP.fromPc,
  step: STEP.fromStep,
  chroma: STEP.fromChroma,
  midi: STEP.fromMidi,
  frequency: STEP.fromFreq,
  accidental: STEP.fromAcc,
  alteration: STEP.fromAlt,
  octave: STEP.fromOct
};

export const STEP_FACTORY = curry((prop, withValue) => {
  const step = FROM[prop](withValue);
  if (!step) return undefined;
  return isStep(step) ? step : undefined;
});
