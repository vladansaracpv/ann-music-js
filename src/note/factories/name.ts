import { Theory } from '../theory';
import { compose, curry, and, or, either } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { Validator } from '../validator';
import { MIDI } from '../factories/midi';

export class NAME {
  static fromMidi = (midi, useSharps = true) => {
    const CHROMA = Math.round(midi) % 12;
    const oct = Math.round(midi) / 12;
    const pc = either(Theory.WITH_SHARPS[CHROMA], Theory.WITH_FLATS[CHROMA], useSharps);
    const octave = Math.floor(oct) - 1;
    return pc + octave;
  };
  static fromName     = name   => name;
  static fromOct      = oct    => ERROR.MISSING_ARGS('name', 'octave', oct, and(['pc'], true));
  static fromFreq     = freq   => compose(NAME.fromMidi, MIDI.fromFreq)(freq);
  static fromLetter   = letter => ERROR.MISSING_ARGS('name', 'letter', letter, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromStep     = step   => ERROR.MISSING_ARGS('name', 'step', step, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromAcc      = acc    => ERROR.MISSING_ARGS('name', 'accidental', acc, and([or(['letter', 'step']), or(['octave'])], true));
  static fromAlt      = alt    => ERROR.MISSING_ARGS('name', 'alteration', alt, and([or(['letter', 'step']), or(['octave'])], true));
  static fromPc       = pc     => ERROR.MISSING_ARGS('name', 'pc', pc, and(['octave'], true));
  static fromChroma   = chroma => ERROR.MISSING_ARGS('name', 'chroma', chroma, and(['octave'], true));
}


const FROM = {
  name:       NAME.fromName,
  midi:       NAME.fromMidi,
  frequency:  NAME.fromFreq,
  letter:     NAME.fromLetter,
  accidental: NAME.fromAcc,
  octave:     NAME.fromOct,
  pc:         NAME.fromPc,
  step:       NAME.fromStep,
  alteration: NAME.fromAlt,
  chroma:     NAME.fromChroma
};

export const NAME_FACTORY = curry((prop, withValue) => {
  const name = FROM[prop](withValue);
  if(!name) return undefined;
  return Validator.isName(name) ? name : undefined;
});
