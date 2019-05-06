import { tokenize, fillStr } from '../base/strings';
import { ErrorCode, CustomError } from '../error/index';
import { compose } from '../base/functional';
import { both } from '../base/boolean';
import { mod, dec, div, mul } from '../base/math';
import { eqs, eq, lt, gt } from '../base/relations';
import { isNumber } from '../base/types';

export const IVL_QUALITIES = {
  d: { long: 'diminished', short: 'd', abbr: '°' },
  m: { long: 'minor', short: 'm', abbr: 'm' },
  M: { long: 'Major', short: 'M', abbr: 'M' },
  P: { long: 'Perfect', short: 'P', abbr: 'P' },
  A: { long: 'Augmented', short: 'A', abbr: '+' },
};

export const AUGMENTED_REGEX = /^A+$/;
export const DIMINISHED_REGEX = /^d+$/;

export const BASE_IVL_TYPES = 'PMMPPMM';
export const BASE_IVL_SIZES = [0, 2, 4, 5, 7, 9, 11];

export const INTERVAL_TONAL = '(?<tn>[-+]?\\d+)(?<tq>d{1,4}|m|M|P|A{1,4})';
export const INTERVAL_QUALITY = '(?<qq>d{1,4}|m|M|P|A{1,4})(?<qn>[-+]?\\d+)';
export const INTERVAL_REGEX = new RegExp(`^${INTERVAL_TONAL}|${INTERVAL_QUALITY}$`);

export const INTERVAL_CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

export const SIMPLE_INTERVAL_NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');
export const SIMPLE_INTERVAL_NUMBERS = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8];
export const SIMPLE_INTERVAL_QUALITIES = 'P m M m M P d P m M m M'.split(' ');

export const SIMPLE_INTERVAL_ALT_NAMES = '2d 1A 3d 2A 4d 3A 5d 6d 5A 7d 6A 8d 7A'.split(' ');
export const SIMPLE_INTERVAL_ALT_NUMBERS = [2, 1, 3, 2, 4, 3, 5, 6, 5, 7, 6, 8, 7];
export const SIMPLE_INTERVAL_ALT_QUALITIES = 'd A d A d A d d A d A d A'.split(' ');

export interface IvlProps {
  name: string;
  num: number;
  quality: string;
  alteration: number;
  step: number;
  direction: number;
  type: string;
  simple: number;
  semitones: number;
  chroma: number;
  octave: number;
  ic: number;
}

/** Cleanup later */
const mod7 = mod(7);
const mod12 = mod(12);
const div7 = div(7);
const signOf = (n: number): number => (n < 0 ? -1 : 1);
const getIntervalBaseType = (step: number) => BASE_IVL_TYPES[step];

function getStepFromNumber(num: number) {
  return compose(
    mod7,
    dec,
    Math.abs,
  )(num);
}
function getIntervalWidth(step: number, alteration: number, octave: number) {
  return BASE_IVL_SIZES[step] + alteration + 12 * dec(octave);
}
export const Validate = {
  Perfect: (type: string, quality: string) => eqs(quality, 'P'),
  Major: (type: string, quality: string) => eqs(quality, 'M'),
  Minor: (type: string, quality: string) => eqs(quality, 'm'),
  Diminished: (quality: string) => /^d+$/.test(quality),
  Augmented: (quality: string) => /^A+$/.test(quality),
};

export function perfectIvlLength(type: string, quality: string) {
  const len = quality.length;
  return eqs(type, 'P') ? -len : -(len + 1);
}

export function qualityToAlteration(type: string, quality: string) {
  if (Validate.Perfect(type, quality) || Validate.Major(type, quality)) return 0;
  if (Validate.Minor(type, quality)) return -1;
  if (Validate.Augmented(quality)) return quality.length;
  if (Validate.Diminished(quality)) return perfectIvlLength(type, quality);
  return null;
}

export const qualityFromAlteration = (type: string, alteration: number) => {
  if (eq(0, alteration)) return eqs(type, 'M') ? 'M' : 'P';
  if (both(eq(-1, alteration), eqs(type, 'M'))) return 'm';
  if (lt(0, alteration)) return fillStr('A', alteration);
  if (gt(0, alteration)) return fillStr('d', eqs(type, 'P') ? alteration : alteration + 1);
  return null;
};

/** Interval Constructors */
export function createIntervalFromName(name: string) {
  const tokens = tokenize(name, INTERVAL_REGEX);

  if (!tokens) return CustomError(ErrorCode.InvalidIvlName, name);

  const num = +(tokens['tn'] || tokens['qn']);
  const quality = tokens['tq'] || tokens['qq'];

  // Similar to Note.letter. Number of steps from first note C to given letter. Normalized to 1 octave
  const step = getStepFromNumber(num);

  // We use it to store information of interval before being altered: d | A. Diminished ivl can be from minor or Perfect
  const type = getIntervalBaseType(step);

  // 1: (low, high) and -1: (high, low)
  const direction = signOf(num);

  // Simple interval number. Used in compound intervals to know which ivl is added to P8
  const simple = num === 8 ? num : direction * (step + 1);

  // Number of octaves Interval spans. For simple it is 1, compound > 1
  const octave = compose(
    Math.ceil,
    div7,
    dec,
    Math.abs,
  )(num);

  // How much is the Interval altered from the base position.
  // Ex: 1) diminished can be -2 (when created from minor) or -1 (from Perfect)
  // Ex: 2) Augmented is altered by +1
  // Ex: 3) Perfect/Major intervals are not altered
  const alteration = qualityToAlteration(type, quality);

  // We calculate width in semitones by adding alteration value to base interval. If is compound we include those octaves
  const semitones = mul(direction, getIntervalWidth(step, alteration, octave));

  // Chroma is position of interval among 12 possible in octave
  const offset = mod12(direction * (BASE_IVL_SIZES[step] + alteration));
  const chroma = (offset + 12) % 12;

  // Interval class. It is between [0,6]
  const ic = INTERVAL_CLASSES[chroma];

  return Object.freeze({
    name: '' + num + quality,
    num,
    quality,
    alteration,
    step,
    type,
    simple,
    semitones,
    direction,
    octave,
    chroma,
    ic,
  });
}

export const build = ({ step, alteration, octave, direction, num = 0 }) => {
  if (step !== undefined) num = step + 1 + 7 * (octave - 1);
  if (eq(num, undefined)) return null;
  if (!isNumber(alteration)) return null;
  let d = !isNumber(direction) ? '' : lt(direction, 0) ? '-' : '';
  const type = BASE_IVL_TYPES[getStepFromNumber(num)];
  return d + num + qualityFromAlteration(type, alteration);
};

/** Interval functions */
export const simplify = (ivl: string) => {
  const props = createIntervalFromName(ivl);

  if (!props) return CustomError(ErrorCode.InvalidIvlName, name);

  const { simple, quality } = props as Partial<IvlProps>;

  return '' + simple + quality;
};

export const invert = (ivl: string) => {
  const props = createIntervalFromName(ivl) as IvlProps;

  if (!props) return CustomError(ErrorCode.InvalidIvlName, name);

  const { step, type, alteration, direction, octave } = props;
  const invStep = (7 - step) % 7;
  const invAlt = eqs(type, 'P') ? -alteration : -(alteration + 1);
  return build({ step: invStep, alteration: invAlt, octave, direction });
};

// import {
//     EMPTY_INTERVAL,
//     NO_INTERVAL,
//     AUGMENTED_REGEX,
//     DIMINISHED_REGEX,
//     INTERVAL_TYPES,
//     INTERVAL_SIZES,
//     INTERVAL_CLASSES,
//     IvlProps,
//     Quality,
//     parseInterval,
// } from "./theory";
// import { glue, pipe, mod, dec, inc, either, compose, divC, len, fillStr, sign, eq } from '../helpers';
// import { midi, step, NoteStatic, NoteType } from '../note/properties';

// /**
//  * Get Chromatic Interval from Notes
//  * @param firstNote
//  * @param secondNote
//  * @returns Object {name, value}
//  */
// export const getChromaticInterval = (firstNote: string, secondNote: string) => {

//     const value = Math.abs(midi(firstNote) - midi(secondNote));

//     return {
//         name: `i${value}`,
//         value
//     }
// };

// /**
//  * Get Generic Interval from Notes
//  * @param firstNote
//  * @param secondNote
//  */
// export const getGenericInterval = (firstNote: string, secondNote: string) => {
//     const [a, b] = [step(firstNote), step(secondNote)];
//     const value = a <= b
//         ? b - 1 + 1
//         : b - a + 8;
//     return {
//         name: `I${value}`,
//         value
//     }
// }

// export const Validate.Major = (quality: string): boolean => eq(quality, Quality.MAJOR);
// export const Validate.Perfect = (quality: string): boolean => eq(quality, Quality.PERFECT);
// export const Validate.Minor = (quality: string): boolean => eq(quality, Quality.MINOR);
// export const Validate.Augmented = (quality: string): boolean => AUGMENTED_REGEX.test(quality);
// export const Validate.Diminished = (quality: string): boolean => DIMINISHED_REGEX.test(quality);

// const intervalAlteration = (type: string, quality: string) => {
//     if (Validate.Major(quality) || Validate.Perfect(type)) return 0;
//     if (Validate.Minor(quality)) return -1;
//     if (Validate.Augmented(quality)) return len(quality);
//     if (Validate.Diminished(quality)) return -len(quality) - either(0, 1, type === Quality.MINOR);
//     return null;
// }

// const intervalQuality = (type: string, alteration: number) => {
//     if (alteration === 0) return either('M', 'P', type === 'M');
//     if (alteration === -1 && type === 'M') return 'm';
//     if (alteration > 0) return fillStr('A', alteration);
//     if (alteration < 0) return fillStr('d', either(alteration, inc(alteration), type === 'P'));
//     return null;
// }

// /**
//  * ('C4', 'D4') => Interval
//  * ({midi: 60}, {midi:70}) => Interval
//  * ('m2') => Interval
//  * ({num:5, quality: 'M'}) => Interval
//  */
// const createIntervalFromNotes = (lower: Partial<NoteType>, higher: Partial<NoteType>) => {
//     const [l, h] = [NoteStatic.create(lower), NoteStatic.create(higher)];
//     const chromatic = getChromaticInterval(l.name, h.name);
//     // const
// }

// const createIntervalFromProps = (props: Partial<IvlProps>) => {

// }

// const IntervalPropsFactory = {
//     fromNotes: createIntervalFromNotes,
//     fromInterval: createIntervalFromProps,
// };

// /**
//  * Create Interval object from string
//  * @param interval
//  */
// export const createIntervalFromString = (interval: string): IvlProps => {

//     const { num, quality } = parseInterval(interval);
//     if (!(num && quality)) return NO_INTERVAL;

//     const name = `${num}${quality}`;
//     const step = pipe(Math.abs, dec, mod(7))(num);
//     const direction = sign(num);
//     const type = INTERVAL_TYPES[step];
//     const simple = either(num, direction * inc(num), Math.abs(num) === 8);
//     const octave = compose(Math.floor, divC(7), dec, Math.abs)(num);
//     const alteration = intervalAlteration(type, quality);
//     const offset = INTERVAL_SIZES[step] + alteration;
//     const semitones = direction * (offset + 12 * octave);
//     const chroma = (direction * offset < 0)
//         ? mod(12)(direction * offset + 12)
//         : mod(12)(direction * offset);

//     const ic = INTERVAL_CLASSES[chroma];

//     return Object.freeze({
//         ...EMPTY_INTERVAL,
//         num,
//         quality,
//         name,
//         step,
//         direction,
//         type,
//         simple,
//         octave,
//         alteration,
//         semitones,
//         chroma,
//         ic
//     });
// }

// // export const createIntervalFromProps = (num: number, semitones: number): IvlProps => {
// //     const direction = sign(num);
// //     const step = pipe(Math.abs, dec, mod(7))(num);
// //     const octave = compose(Math.floor, divC(7), dec, Math.abs)(num);
// //     const offset = semitones / direction - 12 * octave;
// //     const alteration = offset - INTERVAL_SIZES[step];
// //     const type = INTERVAL_TYPES[step];
// //     const quality = intervalQuality(type, alteration);
// //     const name = glue('', num, quality);
// //     const simple = either(num, direction * inc(num), Math.abs(num) === 8);
// //     const chroma = (direction * offset < 0) ? mod(12)(direction * offset + 12) : mod(12)(direction * offset);
// //     const ic = INTERVAL_CLASSES[chroma];

// //     return {
// //         ...EMPTY_INTERVAL,
// //         num,
// //         quality,
// //         name,
// //         step,
// //         direction,
// //         type,
// //         simple,
// //         octave,
// //         alteration,
// //         semitones,
// //         chroma,
// //         ic
// //     }
// // }
