import { curry, and, or } from '../../helpers';
import { FactoryError as ERROR } from '../../error';
import { isMidi } from '../validator';
import { midi } from '../properties';

export class MIDI {
  static fromFreq       = (freq, tuning = 440.0) => Math.ceil(12 * Math.log2(freq / tuning) + 69);
  static fromName       = name   => midi(name);
  static fromMidi       = midi   => midi;
  static fromLetter     = letter => ERROR.MISSING_ARGS('midi', 'letter', letter, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromStep       = step   => ERROR.MISSING_ARGS('midi', 'step', step, and([or(['alteration', 'accidental']), or(['octave'])], true));
  static fromAccidental = acc    => ERROR.MISSING_ARGS('midi', 'accidental', acc, and([or(['letter', 'step']), or(['octave'])], true));
  static fromAlteration = alt    => ERROR.MISSING_ARGS('midi', 'alteration', alt, and([or(['letter', 'step']), or(['octave'])], true));
  static fromPc         = pc     => ERROR.MISSING_ARGS('midi', 'pc', pc, and(['octave']));
  static fromChroma     = chroma => ERROR.MISSING_ARGS('midi', 'chroma', chroma, and(['octave']));
  static fromOctave     = oct    => ERROR.MISSING_ARGS('midi', 'octave', oct, and([or(['letter', 'step']), or(['alteration', 'accidental'])], true));
}

const FROM = {
  midi:       MIDI.fromMidi,
  frequency:  MIDI.fromFreq,
  name:       MIDI.fromName,
  letter:     MIDI.fromLetter,
  step:       MIDI.fromStep,
  accidental: MIDI.fromAccidental,
  alteration: MIDI.fromAlteration,
  pc:         MIDI.fromPc,
  chroma:     MIDI.fromChroma,
  octave:     MIDI.fromOctave
};

export const MIDI_FACTORY = curry((prop, withValue) => {
  const midi = FROM[prop](withValue);
  if(!midi) return undefined;
  return isMidi(midi) ? midi : undefined;
});
  