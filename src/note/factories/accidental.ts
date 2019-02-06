import { compose, curry } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { isAccidental } from '../validator';
import { WITH_SHARPS } from '../theory';

const pcFromChroma = chroma => WITH_SHARPS[chroma];
const pcFromMidi = midi => pcFromChroma(midi % 12);
const midiFromFreq = (freq, tuning = 440.0) => Math.ceil(12 * Math.log2(freq / tuning) + 69);
export class ACCIDENTAL {
  static fromName = name => (name.length === 1 ? '' : name.substring(1));
  static fromAccidental = acc => acc;
  static fromPc = pc => ACCIDENTAL.fromName(pc);
  static fromAlt = alt => (alt < 0 ? 'b'.repeat(-alt) : '#'.repeat(alt));
  static fromChroma = chroma =>
    compose(
      ACCIDENTAL.fromName,
      pcFromChroma
    )(chroma);
  static fromMidi = midi =>
    compose(
      ACCIDENTAL.fromPc,
      pcFromMidi
    )(midi);
  static fromFreq = freq =>
    compose(
      ACCIDENTAL.fromMidi,
      midiFromFreq
    )(freq);
  static fromLetter = letter =>
    ERROR.NO_FACTORY('accidental', 'letter', letter);
  static fromStep = step => ERROR.NO_FACTORY('accidental', 'step', step);
  static fromOct = oct => ERROR.NO_FACTORY('accidental', 'octave', oct);
}

const FROM = {
  accidental: ACCIDENTAL.fromAccidental,
  name: ACCIDENTAL.fromName,
  pc: ACCIDENTAL.fromPc,
  alteration: ACCIDENTAL.fromAlt,
  chroma: ACCIDENTAL.fromChroma,
  midi: ACCIDENTAL.fromMidi,
  frequency: ACCIDENTAL.fromFreq,
  letter: ACCIDENTAL.fromLetter,
  step: ACCIDENTAL.fromStep,
  octave: ACCIDENTAL.fromOct
};

export const ACCIDENTAL_FACTORY = curry((prop, withValue) => {
  const accidental = FROM[prop](withValue);
  if (!accidental) return undefined;
  return isAccidental(accidental) ? accidental : undefined;
});
