import { tokenize, fillStr } from '../../base/strings';
import { ErrorCode, CustomError } from '../../error/index';
import { compose } from '../../base/functional';
import { and2 } from '../../base/logical';
import { modC, dec, divC, mul2, mulC, inc } from '../../base/math';
import { eq, lt, gt } from '../../base/relations';
import { isNumber, isString } from '../../base/types';
import { midi, NoteName } from '../note/index';
import { either } from '../../base/boolean';

type IvlName = string;
type IvlNumber = number;
type IvlQuality = 'd' | 'm' | 'M' | 'P' | 'A';
type IvlAlteration = number;
type IvlStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type IvlDirection = -1 | 1;
type IvlType = 'M' | 'P';
type IvlSimpleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type IvlSemitones = number;
type IvlChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type IvlOctave = number;
type IvlClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface IvlProps {
  name: IvlName;
  num: IvlNumber;
  quality: IvlQuality;
  alteration: IvlAlteration;
  step: IvlStep;
  direction: IvlDirection;
  type: IvlType;
  simple: IvlSimpleNumber;
  semitones: IvlSemitones;
  chroma: IvlChroma;
  octave: IvlOctave;
  ic: IvlClass;
}

export const INTERVALL_QUALITIES = {
  d: { long: 'diminished', short: 'd', abbr: '°' },
  m: { long: 'minor', short: 'm', abbr: 'm' },
  M: { long: 'Major', short: 'M', abbr: 'M' },
  P: { long: 'Perfect', short: 'P', abbr: 'P' },
  A: { long: 'Augmented', short: 'A', abbr: '+' },
};

/**
  +----+----+----+----+----+----+----+----+----+----+----+----+----+
  | 0  | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 | 11 | 12 |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | C  | C# | D  | D# | E  | F  | F# | G  | G# | A  | A# | B  | C  |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | P1 | A1 | M2 | A2 | M3 | P4 | A4 | P5 | A5 | M6 | A6 | M7 | P8 |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | C  | Db | D  | Eb | E  | F  | Gb | G  | Ab | A  | Bb | B  | C  |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | P1 | m2 | M2 | m3 | M3 | P4 | d5 | P5 | m6 | M6 | m7 | M7 | P8 |
  | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
  | d2 | A1 | d3 | A2 | d4 | A3 |d5A4| d6 | A5 | d7 | A6 | d8 | A7 |
  +----+----+----+----+----+----+----+----+----+----+----+----|----+
*/

export const BASE_INTERVAL_TYPES = 'PMMPPMM';
export const BASE_INTERVAL_SIZES = [0, 2, 4, 5, 7, 9, 11];

export const AUGMENTED_REGEX = /^A+$/;
export const DIMINISHED_REGEX = /^d+$/;

export const INTERVAL_TONAL = '(?<tn>[-+]?\\d+)(?<tq>d{1,4}|m|M|P|A{1,4})';
export const INTERVAL_QUALITY = '(?<qq>d{1,4}|m|M|P|A{1,4})(?<qn>[-+]?\\d+)';
export const INTERVAL_REGEX = new RegExp(`^${INTERVAL_TONAL}|${INTERVAL_QUALITY}$`);

export const INTERVAL_CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

export const INTERVAL_NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M'.split(' ');
export const INTERVAL_NUMBERS = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7];
export const INTERVAL_QUALITIES = 'P m M m M P d P m M m M'.split(' ');

export const Validator = {
  Perfect: (type: string, quality: string) => eq(quality, 'P'),
  Major: (type: string, quality: string) => eq(quality, 'M'),
  Minor: (type: string, quality: string) => eq(quality, 'm'),
  Diminished: (quality: string) => /^d+$/.test(quality),
  Augmented: (quality: string) => /^A+$/.test(quality),
};

/** Cleanup later */

const signOf = (n: number): number => either(-1, 1, lt(n, 0));

const numberForOffset = (direction: number, chroma: number, octave: number) => {
  return mul2(direction, INTERVAL_NUMBERS[chroma] + 7 * octave);
};

export function perfectIvlLength(type: string, quality: string) {
  const len = quality.length;
  return either(-len, -(len + 1), eq(type, 'P'));
}

export function qualityToAlteration(type: string, quality: string) {
  if (Validator.Perfect(type, quality) || Validator.Major(type, quality)) return 0;
  if (Validator.Minor(type, quality)) return -1;
  if (Validator.Augmented(quality)) return quality.length;
  if (Validator.Diminished(quality)) return perfectIvlLength(type, quality);
  return null;
}

export const qualityFromAlteration = (type: string, alteration: number) => {
  if (eq(0, alteration)) return either('M', 'P', eq(type, 'M'));
  if (and2(eq(-1, alteration), eq(type, 'M'))) return 'm';
  if (gt(alteration, 0)) return fillStr('A', alteration);
  if (lt(alteration, 0)) return fillStr('d', either(alteration, inc(alteration), eq(type, 'P')));
  return null;
};

/** Interval Constructors */
export function createIntervalFromName(name: string) {
  const tokens = tokenize(name, INTERVAL_REGEX);

  if (!tokens) return CustomError(ErrorCode.InvalidIvlName, name);

  const num = +(tokens['tn'] || tokens['qn']);
  const quality = tokens['tq'] || tokens['qq'];

  // Similar to Note.letter. Number of steps from first note C to given letter. Normalized to 1 octave
  const step = dec(Math.abs(num)) % 7;

  // We use it to store information of interval before being altered: d | A. Diminished ivl can be from minor or Perfect
  const type = BASE_INTERVAL_TYPES[step];

  // 1: (low, high) and -1: (high, low)
  const direction = signOf(num);

  // Simple interval number. Used in compound intervals to know which ivl is added to P8
  const simple = either(num, direction * (step + 1), eq(num, 8));

  // Number of octaves Interval spans. For simple it is 1, compound > 1
  const octave = compose(
    Math.ceil,
    divC(7),
    dec,
    Math.abs,
  )(num);

  // How much is the Interval altered from the base position.
  // Ex: 1) diminished can be -2 (when created from minor) or -1 (from Perfect)
  // Ex: 2) Augmented is altered by +1
  // Ex: 3) Perfect/Major intervals are not altered
  const alteration = qualityToAlteration(type, quality);

  // We calculate width in semitones by adding alteration value to base interval. If is compound we include those octaves
  const width = BASE_INTERVAL_SIZES[step] + alteration + 12 * dec(octave);
  const semitones = mul2(direction, width);

  // Chroma is position of interval among 12 possible in octave
  const offset = (direction * (BASE_INTERVAL_SIZES[step] + alteration)) % 12;

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
  const [direction, distance] = [signOf(semitones), Math.abs(semitones)];
  const [chroma, octave] = [distance % 12, Math.floor(distance / 12)];
  const number = numberForOffset(direction, chroma, octave);
  return createIntervalFromName('' + number + INTERVAL_QUALITIES[chroma]);
}

export function createIntervalFromNotes(first: NoteName, second: NoteName) {
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
export const build = ({ step = 0, alteration = 0, octave = 4, direction = 1, num = 0 }) => {
  if (step !== undefined) num = step + 1 + 7 * (octave - 1);
  if (eq(num, undefined)) return null;
  if (!isNumber(alteration)) return null;
  let d = !isNumber(direction) ? '' : lt(direction, 0) ? '-' : '';
  const type = BASE_INTERVAL_TYPES[dec(Math.abs(num)) % 7];
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
  const invAlt = either(-alteration, -(alteration + 1), eq(type, 'P'));
  return build({ step: invStep, alteration: invAlt, octave, direction });
};

export const chroma = (str: string) => Interval(str)['chroma'];
