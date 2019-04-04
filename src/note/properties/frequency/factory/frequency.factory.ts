
// import { curry, and, or } from '../../helpers';
// import { FactoryError as ERROR } from '../../error';
// import { isFrequency } from '../validator';
// import { frequency } from '../properties';


// export class FREQUENCY {
//   static fromMidi = (midi, tuning = 440) => 2 ** ((midi - 69) / 12) * tuning;
//   static fromFreq       = (freq, tuning = 440) => freq;
//   static fromName       = name   => frequency(name);
//   static fromLetter     = letter => ERROR.MISSING_ARGS('frequency', 'letter', letter, and([or(['alteration', 'accidental']), or(['octave'])], true));
//   static fromStep       = step   => ERROR.MISSING_ARGS('frequency', 'step', step, and([or(['alteration', 'accidental']), or(['octave'])], true));
//   static fromAccidental = acc    => ERROR.MISSING_ARGS('frequency', 'accidental', acc, and([or(['letter', 'step']), or(['octave'])], true));
//   static fromAlteration = alt    => ERROR.MISSING_ARGS('frequency', 'alteration', alt, and([or(['letter', 'step']), or(['octave'])], true));
//   static fromPc         = pc     => ERROR.MISSING_ARGS('frequency', 'pc', pc, and(['octave']));
//   static fromChroma     = chroma => ERROR.MISSING_ARGS('frequency', 'chroma', chroma, and(['octave']));
//   static fromOctave     = oct    => ERROR.MISSING_ARGS('frequency', 'octave', oct, and([or(['letter', 'step']), or(['alteration', 'accidental'])], true));
// }

// const FROM = {
//   midi:       FREQUENCY.fromMidi,
//   frequency:  FREQUENCY.fromFreq,
//   name:       FREQUENCY.fromName,
//   letter:     FREQUENCY.fromLetter,
//   step:       FREQUENCY.fromStep,
//   accidental: FREQUENCY.fromAccidental,
//   alteration: FREQUENCY.fromAlteration,
//   pc:         FREQUENCY.fromPc,
//   chroma:     FREQUENCY.fromChroma,
//   octave:     FREQUENCY.fromOctave
// };

// export const FREQUENCY_FACTORY = curry((prop, withValue) => {
//   const freq = FROM[prop](withValue);
//   if(!freq) return undefined;
//   return isFrequency(freq) ? freq : undefined;
// });
