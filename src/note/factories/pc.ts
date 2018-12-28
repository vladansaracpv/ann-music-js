import { Theory } from '../theory';
import { compose, curry, or } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { Validator } from '../validator';
import { MIDI } from '../factories/midi';



export class PC {
  static fromName   = name   => name(name);
  static fromPc     = pc     => pc;
  static fromChroma = chroma => Theory.WITH_SHARPS[chroma];
  static fromMidi   = midi   => PC.fromChroma(midi % 12);
  static fromFreq   = freq   => compose(PC.fromMidi, MIDI.fromFreq)(freq);
  static fromLetter = letter => ERROR.MISSING_ARGS('pc', 'letter', letter, or(['accidental', 'alteration']));
  static fromStep   = step   => ERROR.MISSING_ARGS('pc', 'step', step, or(['accidental', 'alteration']));
  static fromAcc    = acc    => ERROR.MISSING_ARGS('pc', 'octave', acc, or(['letter', 'step']));
  static fromAlt    = alt    => ERROR.MISSING_ARGS('pc', 'octave', alt, or(['letter', 'step']));
  static fromOct    = oct    => ERROR.NO_FACTORY('pc', 'octave', oct);
}


const FROM = {
  pc:         PC.fromPc,
  name:       PC.fromName,
  chroma:     PC.fromChroma,
  midi:       PC.fromMidi,
  frequency:  PC.fromFreq,
  letter:     PC.fromLetter,
  step:       PC.fromStep,
  accidental: PC.fromAcc,
  alteration: PC.fromAlt,
  octave:     PC.fromOct
};

export const PC_FACTORY = curry((prop, withValue) => {
  const pc = FROM[prop](withValue);
  if(!pc) return undefined;
  return Validator.isPc(pc) ? pc : undefined;
});
