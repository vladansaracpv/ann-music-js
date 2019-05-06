import { tokenize, fillStr } from '../../base/strings';
import { ErrorCode, CustomError } from '../../error/index';
import { compose } from '../../base/functional';
import { both } from '../../base/boolean';
import { mod, dec, divC, mul, mulC } from '../../base/math';
import { eq, lt, gt } from '../../base/relations';
import { isNumber, isString } from '../../base/types';
import { midi, NoteInitProp } from '../note/properties';

export const INTERVALL_QUALITIES = {
  d: { long: 'diminished', short: 'd', abbr: '°' },
  m: { long: 'minor', short: 'm', abbr: 'm' },
  M: { long: 'Major', short: 'M', abbr: 'M' },
  P: { long: 'Perfect', short: 'P', abbr: 'P' },
  A: { long: 'Augmented', short: 'A', abbr: '+' },
};

export const BASE_INTERVAL_TYPES = 'PMMPPMM';
export const BASE_INTERVAL_SIZES = [0, 2, 4, 5, 7, 9, 11];

export const AUGMENTED_REGEX = /^A+$/;
export const DIMINISHED_REGEX = /^d+$/;

export const INTERVAL_TONAL = '(?<tn>[-+]?\\d+)(?<tq>d{1,4}|m|M|P|A{1,4})';
export const INTERVAL_QUALITY = '(?<qq>d{1,4}|m|M|P|A{1,4})(?<qn>[-+]?\\d+)';
export const INTERVAL_REGEX = new RegExp(`^${INTERVAL_TONAL}|${INTERVAL_QUALITY}$`);

export const INTERVAL_CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

export const INTERVAL_NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');
export const INTERVAL_NUMBERS = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 8];
export const INTERVAL_QUALITIES = 'P m M m M P d P m M m M'.split(' ');

export const INTERVAL_ALT_NAMES = '2d 1A 3d 2A 4d 3A 5d 6d 5A 7d 6A 8d 7A'.split(' ');
export const INTERVAL_ALT_NUMBERS = [2, 1, 3, 2, 4, 3, 5, 6, 5, 7, 6, 8, 7];
export const INTERVAL_ALT_QUALITIES = 'd A d A d A d d A d A d A'.split(' ');

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
// export const KEYS = [
//   'name',
//   'num',
//   'quality',
//   'step',
//   'alteration',
//   'direction',
//   'type',
//   'simple',
//   'semitones',
//   'chroma',
//   'octave',
//   'ic',
// ];

// export const EMPTY_INTERVAL = {
//   name: undefined,
//   num: undefined,
//   quality: undefined,
//   step: undefined,
//   alteration: undefined,
//   direction: undefined,
//   type: undefined,
//   simple: undefined,
//   semitones: undefined,
//   chroma: undefined,
//   octave: undefined,
//   ic: undefined,
// };

// export const NO_INTERVAL = Object.freeze(EMPTY_INTERVAL);

export const Validate = {
  Perfect: (type: string, quality: string) => eq(quality, 'P'),
  Major: (type: string, quality: string) => eq(quality, 'M'),
  Minor: (type: string, quality: string) => eq(quality, 'm'),
  Diminished: (quality: string) => /^d+$/.test(quality),
  Augmented: (quality: string) => /^A+$/.test(quality),
};

/** Cleanup later */
const mod12 = mod(12);
const div7 = divC(7);
const mul7 = mulC(7);
const signOf = (n: number): number => (n < 0 ? -1 : 1);
const getIntervalBaseType = (step: number) => BASE_INTERVAL_TYPES[step];
const widthInOctaves = (distance: number) => Math.floor(distance / 12);

const widthInSemitones = (semitones: number) => Math.abs(semitones);
const chromaFromWidth = (distance: number) => mod12(distance);
const numberForOffset = (direction: number, chroma: number, octave: number) =>
  mul(direction, INTERVAL_NUMBERS[chroma] + mul7(octave));
const getStepFromNumber = (num: number) => dec(Math.abs(num)) % 7;

const getIntervalWidth = (step: number, alteration: number, octave: number) =>
  BASE_INTERVAL_SIZES[step] + alteration + 12 * dec(octave);

export function perfectIvlLength(type: string, quality: string) {
  const len = quality.length;
  return eq(type, 'P') ? -len : -(len + 1);
}

export function qualityToAlteration(type: string, quality: string) {
  if (Validate.Perfect(type, quality) || Validate.Major(type, quality)) return 0;
  if (Validate.Minor(type, quality)) return -1;
  if (Validate.Augmented(quality)) return quality.length;
  if (Validate.Diminished(quality)) return perfectIvlLength(type, quality);
  return null;
}

export const qualityFromAlteration = (type: string, alteration: number) => {
  if (eq(0, alteration)) return eq(type, 'M') ? 'M' : 'P';
  if (both(eq(-1, alteration), eq(type, 'M'))) return 'm';
  if (lt(0, alteration)) return fillStr('A', alteration);
  if (gt(0, alteration)) return fillStr('d', eq(type, 'P') ? alteration : alteration + 1);
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
  const offset = mod12(direction * (BASE_INTERVAL_SIZES[step] + alteration));
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

export function createIntervalFromSemitones(semitones: number) {
  const [direction, distance] = [signOf(semitones), widthInSemitones(semitones)];
  const [chroma, octave] = [chromaFromWidth(distance), widthInOctaves(distance)];
  const number = numberForOffset(direction, chroma, octave);
  return createIntervalFromName('' + number + INTERVAL_QUALITIES[chroma]);
}

export function createIntervalFromNotes(first: NoteInitProp, second: NoteInitProp) {
  const semitones = midi(second) - midi(first);
  return createIntervalFromSemitones(semitones);
}

export function Interval(...args) {
  if (args.length > 1) return createIntervalFromNotes(args[0], args[1]);
  if (isString(args[0])) return createIntervalFromName(args[0]);
  if (isNumber(args[0])) return createIntervalFromSemitones(args[0]);
  return CustomError(ErrorCode.InvalidIvlConstructor, args);
}

/** Interval functions */
export const build = ({ step, alteration, octave, direction, num = 0 }) => {
  if (step !== undefined) num = step + 1 + 7 * (octave - 1);
  if (eq(num, undefined)) return null;
  if (!isNumber(alteration)) return null;
  let d = !isNumber(direction) ? '' : lt(direction, 0) ? '-' : '';
  const type = BASE_INTERVAL_TYPES[getStepFromNumber(num)];
  return d + num + qualityFromAlteration(type, alteration);
};

export const simplifyInterval = (ivl: string) => {
  const props = createIntervalFromName(ivl);

  if (!props) return CustomError(ErrorCode.InvalidIvlName, name);

  const { simple, quality } = props as Partial<IvlProps>;

  return '' + simple + quality;
};

export const invertInterval = (ivl: string) => {
  const props = createIntervalFromName(ivl) as IvlProps;

  if (!props) return CustomError(ErrorCode.InvalidIvlName, name);

  const { step, type, alteration, direction, octave } = props;
  const invStep = (7 - step) % 7;
  const invAlt = eq(type, 'P') ? -alteration : -(alteration + 1);
  return build({ step: invStep, alteration: invAlt, octave, direction });
};
