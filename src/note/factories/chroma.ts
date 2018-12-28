import { Theory } from '../theory';
import { compose, curry, firstLetter, or } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { Validator } from '../validator';
import { chroma } from '../properties';
import { MIDI } from '../factories/midi';

export class CHROMA {
  static fromPc     = pc     => pc.indexOf('#') > 0 ? Theory.SHARPS.indexOf(pc) : Theory.FLATS.indexOf(pc);
  static fromName   = name   => chroma(name);
  static fromChroma = chroma => chroma;
  static fromMidi   = midi   => CHROMA.fromChroma(midi % 12);
  static fromFreq   = freq   => compose(CHROMA.fromMidi, MIDI.fromFreq)(freq);
  static fromLetter = letter => ERROR.MISSING_ARGS('chroma', 'letter', letter, or(['accidental', 'alteration']));
  static fromStep   = step   => ERROR.MISSING_ARGS('chroma', 'step', step, or(['accidental', 'alteration']));
  static fromAcc    = acc    => ERROR.MISSING_ARGS('chroma', 'octave', acc, or(['letter', 'step']));
  static fromAlt    = alt    => ERROR.MISSING_ARGS('chroma', 'octave', alt, or(['letter', 'step']));
  static fromOct    = oct    => ERROR.NO_FACTORY('chroma', 'octave', oct);
}

const FROM = {
  pc:         CHROMA.fromPc,
  name:       CHROMA.fromName,
  chroma:     CHROMA.fromChroma,
  midi:       CHROMA.fromMidi,
  frequency:  CHROMA.fromFreq,
  letter:     CHROMA.fromLetter,
  step:       CHROMA.fromStep,
  accidental: CHROMA.fromAcc,
  alteration: CHROMA.fromAlt,
  octave:     CHROMA.fromOct
};

export const CHROMA_FACTORY = curry((prop, withValue) => {
  const chroma = FROM[prop](withValue);
  if(!chroma) return undefined;
  return Validator.isChroma(chroma) ? chroma : undefined;
});
