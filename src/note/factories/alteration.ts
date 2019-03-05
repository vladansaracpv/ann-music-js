// import { compose, curry, charAt } from '../../helpers';
// import { FactoryError as ERROR } from '../../error';
// import { isAlteration } from '../validator';
// import { PC } from '../factories/pc';
// import { MIDI } from '../factories/midi';

// export class ALTERATION {
//   static fromAccidental = acc => charAt(0)(`${acc} `) === '#' ? acc.length : -acc.length;
//   static fromName = name => name.length === 1 ? 0 : ALTERATION.fromAccidental(name.substring(1));
//   static fromPc = pc => ALTERATION.fromName(pc);
//   static fromAlt = alt => alt;
//   static fromChroma = chroma => compose(ALTERATION.fromName, PC.fromChroma)(chroma);
//   static fromMidi = midi => compose(ALTERATION.fromPc, PC.fromMidi)(midi);
//   static fromFreq = freq => compose(ALTERATION.fromMidi, MIDI.fromFreq)(freq);
//   static fromLetter = letter => ERROR.NO_FACTORY('alteration', 'letter', letter);
//   static fromStep = step => ERROR.NO_FACTORY('alteration', 'step', step);
//   static fromOct = oct => ERROR.NO_FACTORY('alteration', 'octave', oct);
// }

// const FROM = {
//   accidental: ALTERATION.fromAccidental,
//   name: ALTERATION.fromName,
//   pc: ALTERATION.fromPc,
//   alteration: ALTERATION.fromAlt,
//   chroma: ALTERATION.fromChroma,
//   midi: ALTERATION.fromMidi,
//   frequency: ALTERATION.fromFreq,
//   letter: ALTERATION.fromLetter,
//   step: ALTERATION.fromStep,
//   octave: ALTERATION.fromOct
// };

// export const ALTERATION_FACTORY = curry((prop, withValue) => {
//   const alteration = FROM[prop](withValue);
//   if (!alteration) return undefined;
//   return isAlteration(alteration) ? alteration : undefined;
// });
