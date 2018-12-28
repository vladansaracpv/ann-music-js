import { compose, curry } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { Validator } from '../validator';
import { octave } from '../properties';
import { MIDI } from '../factories/midi';

export class OCTAVE {
  static fromName   = name   => octave(name);
  static fromOctave = octave => octave;
  static fromMidi   = midi   => Math.floor(midi / 12) - 1;
  static fromFreq   = freq   => compose(OCTAVE.fromMidi, MIDI.fromFreq)(freq);
  static fromLetter = letter => ERROR.NO_FACTORY('octave', 'letter', letter);
  static fromAcc    = acc    => ERROR.NO_FACTORY('octave', 'accidental', acc);
  static fromPc     = pc     => ERROR.NO_FACTORY('octave', 'pc', pc);
  static fromStep   = step   => ERROR.NO_FACTORY('octave', 'step', step);
  static fromAlt    = alt    => ERROR.NO_FACTORY('octave', 'alteration', alt);
  static fromChroma = chroma => ERROR.NO_FACTORY('octave', 'chroma', chroma);
}


const FROM = {
  octave:     OCTAVE.fromOctave,
  name:       OCTAVE.fromName,
  midi:       OCTAVE.fromMidi,
  frequency:  OCTAVE.fromFreq,
  letter:     OCTAVE.fromLetter,
  accidental: OCTAVE.fromAcc,
  pc:         OCTAVE.fromPc,
  step:       OCTAVE.fromStep,
  alteration: OCTAVE.fromAlt,
  chroma:     OCTAVE.fromChroma
};

export const OCTAVE_FACTORY = curry((prop, withValue) => {
  const octave = FROM[prop](withValue);
  if(!octave) return undefined;
  return Validator.isOctave(octave) ? octave : undefined;
});
  