import {
  BaseArray,
  BaseBoolean,
  BaseErrors,
  BaseFunctional,
  BaseLogical,
  BaseMaths,
  BaseRelations,
  BaseStrings,
  BaseTypings,
} from 'ann-music-base';
import { InitProp, NOTE, NoteName } from 'ann-music-note';

const { fillStr } = BaseArray;
const { either } = BaseBoolean;
const { CustomError } = BaseErrors;
const { compose } = BaseFunctional;
const { and: both } = BaseLogical;
const { dec, divC, inc, modC } = BaseMaths;
const { eq, gt, isNegative, lt } = BaseRelations;
const { tokenize } = BaseStrings;
const { isArray, isInteger, isNumber, isObject } = BaseTypings;

const IntervalError = CustomError('Interval');

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  INTERVAL - INTERFACES                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** Interval name with shape: number + quality. @example 3M */
export type IntervalName = string;

/** Generic interval number. Number of diatonic steps between two notes */
export type IntervalNumber = number;

/** Possible interval qualities */
export type IntervalQuality = 'dd' | 'd' | 'm' | 'M' | 'P' | 'A' | 'AA';

/**
 * In natural scale, there are just M and P intervals.
 * All other qualities are alterations by some amount
 */
export type IntervalAlteration = number;

/** Similar to NoteStep. Number of letters from first to second note */
export type IntervalStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Direction of I(N1, N2) is positive if N1 < N2. Negative otherwise */
export type IntervalDirection = -1 | 1;

/**
 * Basic interval (qualities).
 * All others are derived from it. M => d, m, A; P => d, A
 */
export type IntervalType = 'M' | 'P';

/**
 * Simple number is normalized IntervalNumber to single octave.
 * M9 => P8 + M2
 */
export type IntervalSimpleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Width of the interval in semitones */
export type IntervalSemitones = number;

/**
 * Similar to Note.chroma.
 * It is an index of interval in list of 12 basic intervals
 */
export type IntervalChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/**
 * How many octaves does the interval encompass.
 * For simple it is = 1, compound: > 1
 */
export type IntervalOctave = number;

/** Interval class is the minimum distance in steps of I(N1,N2), I(N2, N1) */
export type IntervalClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  INTERVAL - INTERFACES                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export type IntervalProps = Readonly<{
  name: IntervalName;
  num: IntervalNumber;
  quality: IntervalQuality;
  alteration: IntervalAlteration;
  step: IntervalStep;
  direction: IntervalDirection;
  type: IntervalType;
  simple: IntervalSimpleNumber;
  semitones: IntervalSemitones;
  chroma: IntervalChroma;
  octave: IntervalOctave;
  ic: IntervalClass;
  valid: boolean;
}>;

export interface NoInterval extends Partial<IntervalProps> {
  readonly valid: false;
  readonly name: '';
}

export type IvlInitProp = IntervalName | IntervalSemitones | NoteName[];

export interface IntervalBuild {
  step?: IntervalStep;
  alteration?: IntervalAlteration;
  octave?: IntervalOctave;
  direction?: IntervalDirection;
  num?: IntervalNumber;
}

namespace Theory {
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *              INTERVAL - THEORY CONSTANTS                *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  /**
   * C-major scale interval qualities.
   * Every other interval is made from these
   */
  export const BASE_QUALITIES = 'PMMPPMM';

  /** Chroma indexes (places) of base interval types in chromatic scale */
  export const BASE_SIZES = [0, 2, 4, 5, 7, 9, 11];

  /** Regular expression used to parse Augmented intervals **/
  export const AUG_REGEX = /^A{1,2}$/;

  /** Regular expression used to parse Diminished intervals **/
  export const DIM_REGEX = /^d{1,2}$/;

  /** Regular expression used to tokenize Interval of shape <number><quality> **/
  export const TONAL_REGEX = '(?<tn>[-+]?\\d+)(?<tq>d{1,2}|m|M|P|A{1,2})';

  /** Regular expression used to tokenize Interval of shape <quality><number> **/
  export const QUALITY_REGEX = '(?<qq>d{1,4}|m|M|P|A{1,4})(?<qn>[-+]?\\d+)';

  /** Union of previous two regular expressions **/
  export const INTERVAL_REGEX = new RegExp(`^${TONAL_REGEX}|${QUALITY_REGEX}$`);

  /**
   * Shortest distance in pitch class space between two unordered pitch classes.
   * ic(a,b) = min((a-b) % 12, (b-a) % 12)
   *
   * @example
   * The ic between pitch classes 4 and 9 is 5 because 9 − 4 = 5, which is less than: 4 − 9 = −5 ≡ 7 (mod 12)
   */
  export const CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

  /** Names of the intervals in chromatic octave */
  export const NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');
  export const NAMES_ALTERNATE = '1P 1A 2M 2A 3M 4P 4A 5P 5A 6M 6A 7M 8P'.split(' ');

  /** Scale degrees to which interval at index:i is assigned */
  export const NUMBERS = [1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7];

  /** Qualities of intervals at index:i */
  export const QUALITIES = 'P m M m M P d P m M m M P'.split(' ');
  export const QUALITIES_ALTERNAT = 'P A M A M P A P A M A M P'.split(' ');

  export const EmptyInterval = {
    name: '',
    valid: false,
  };
}

namespace Static {
  export const Validators = {
    isIntervalName: (name: IvlInitProp): name is IntervalName => Theory.INTERVAL_REGEX.test(name as IntervalName),
    isPerfect: (quality: string) => eq(quality, 'P'),
    isMajor: (quality: string) => eq(quality, 'M'),
    isMinor: (quality: string) => eq(quality, 'm'),
    isDiminished: (quality: string) => Theory.DIM_REGEX.test(quality),
    isAugmented: (quality: string) => Theory.AUG_REGEX.test(quality),
  };

  export const Quality = {
    toAlteration(type: string, quality: string) {
      const len = quality.length;
      const { isAugmented, isDiminished } = Validators;

      if ('PM'.includes(quality)) return 0;

      if (eq(quality, 'm')) return -1;

      if (isAugmented(quality)) return len;

      if (isDiminished(quality)) return -1 * either(len, inc(len), eq(type, 'P'));

      return undefined;
    },
  };

  export const Alteration = {
    toQuality(type: string, alteration: number) {
      if (eq(0, alteration)) return either('M', 'P', eq(type, 'M'));

      if (both(eq(-1, alteration), eq(type, 'M'))) return 'm';

      if (gt(alteration, 0)) return fillStr('A', alteration);

      if (lt(alteration, 0)) return fillStr('d', either(alteration, inc(alteration), eq(type, 'P')));

      return undefined;
    },
  };

  export const Num = {
    toStep(num: IntervalNumber) {
      return compose(
        modC(7),
        dec,
        Math.abs,
      )(num);
    },
  };

  export function simplify(ivl: IntervalName): IntervalName {
    const interval = Interval(ivl);

    if (!interval.valid) return undefined;

    const { simple, quality } = interval as Partial<IntervalProps>;

    return ('' + simple + quality) as IntervalName;
  }

  export function invert(ivl: IntervalName): IntervalName {
    const interval = Interval(ivl);

    if (!interval.valid) return undefined;

    const { step, type, alteration, direction, octave } = interval;

    const invStep = ((7 - step) % 7) as IntervalStep;

    const invAlt = -1 * either(alteration, inc(alteration), eq(type, 'P'));

    return build({ step: invStep, alteration: invAlt, octave, direction });
  }

  export const property = (name: string) => (interval: IntervalName) => {
    const ivl = Interval(interval);
    return ivl.valid ? ivl[name] : undefined;
  };

  export function build(params: IntervalBuild = { octave: 1, direction: 1 }): IntervalName {
    let { step, alteration, octave, direction, num } = params;
    if (step !== undefined) num = inc(step) + 7 * dec(octave);
    if (eq(num, undefined)) return undefined;
    if (!isNumber(alteration)) return undefined;
    let d = lt(direction, 0) ? '-' : '';
    const type = Theory.BASE_QUALITIES[dec(Math.abs(num)) % 7];
    return d + num + Alteration.toQuality(type, alteration);
  }

  export function intervalTable(harmonic: number, generic: number) {
    const i0 = { 1: '1P', 2: '2d' };
    const i1 = { 1: '1A', 2: '2m', 3: '3dd' };
    const i2 = { 1: '1AA', 2: '2M', 3: '3d' };
    const i3 = { 2: '2A', 3: '3m', 4: '4dd' };
    const i4 = { 2: '2AA', 3: '3M', 4: '4d' };
    const i5 = { 3: '3A', 4: '4P', 5: '5dd' };
    const i6 = { 3: '3AA', 4: '4A', 5: '5d', 6: '6dd' };
    const i7 = { 4: '4AA', 5: '5P', 6: '6d' };
    const i8 = { 5: '5A', 6: '6m', 7: '7dd' };
    const i9 = { 5: '5AA', 6: '6M', 7: '7d' };
    const i10 = { 6: '6A', 7: '7m', 8: '8dd' };
    const i11 = { 6: '6AA', 7: '7M', 8: '8d' };
    const i12 = { 7: '7A', 8: '8P' };
    const table = [i0, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12];

    return table[harmonic][generic];
  }
}

export const INTERVAL = {
  ...Theory,
  ...Static,
};

/**
 * Interval factory function
 * @param {IntervalInitProps} props
 * @return {IntervalProps}
 */
export function Interval(prop: IvlInitProp): IntervalProps {
  const { isIntervalName } = INTERVAL.Validators;
  const { isName: isNoteName } = NOTE.Validators;
  const { EmptyInterval } = Theory;
  const { toAlteration } = INTERVAL.Quality;
  const { toStep } = INTERVAL.Num;
  const { INTERVAL_REGEX, BASE_QUALITIES, BASE_SIZES, CLASSES, NAMES } = Theory;
  const { intervalTable } = Static;

  const intervalTypeFrom = (harmonic: number, generic: number) => intervalTable(harmonic, generic);

  function fromName(src: IntervalName): IntervalProps {
    if (!isIntervalName(src)) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    const tokens = tokenize(src, INTERVAL_REGEX);

    if (!tokens) return EmptyInterval as IntervalProps;

    const { tn: tshapeNum, qn: qshapeNum, tq: tshapeQuality, qq: qshapeQuality } = tokens;

    const num = +(tshapeNum || qshapeNum) as IntervalNumber;

    if (!num) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    const quality = (tshapeQuality || qshapeQuality) as IntervalQuality;

    if (quality.length > 2) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    /**
     *  Similar to NOTE.letter.
     *  Number of steps from first note C to given letter.
     *  Normalized to 1 octave
     */
    const step = toStep(num) as IntervalStep;

    /**
     *  We use it to store information of interval before being altered: d | A.
     *  Diminished ivl can be from minor or Perfect
     */
    const type = BASE_QUALITIES[step] as IntervalType;

    // 1: (low, high) and -1: (high, low)
    const direction = either(-1, 1, isNegative(num)) as IntervalDirection;

    // Simple interval number. Used in compound intervals to know which ivl is added to P8
    const simple = either(num, direction * inc(step), eq(num, 8)) as IntervalSimpleNumber;

    // Number of octaves Interval spans. For simple it is 1, compound > 1
    const octave = compose(
      Math.ceil,
      divC(7),
      Math.abs,
    )(num) as IntervalOctave;

    // How much is the Interval altered from the base position.
    // Ex: 1) diminished can be -2 (when created from minor) or -1 (from Perfect)
    // Ex: 2) Augmented is altered by +1
    // Ex: 3) Perfect/Major intervals are not altered
    const alteration = toAlteration(type, quality) as IntervalAlteration;

    // We calculate width in semitones by adding alteration value to base interval.
    // If is compound we include those octaves
    const width = BASE_SIZES[step] + alteration + 12 * dec(octave);

    const semitones = (direction * width) as IntervalSemitones;

    // Chroma is position of interval among 12 possible in octave
    const offset = (direction * (BASE_SIZES[step] + alteration)) % 12;

    const chroma = ((offset + 120) % 12) as IntervalChroma;

    // Interval class. It is between [0,6]
    const ic = CLASSES[chroma] as IntervalClass;

    const name = ('' + num + quality) as IntervalName;

    const valid = true;

    return {
      name,
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
      valid,
    };
  }

  function fromDistance(semitones: IntervalSemitones): IntervalProps {
    if (!isInteger(semitones))
      return IntervalError('InvalidIvlConstructor', { semitones }, EmptyInterval) as IntervalProps;

    const direction = either(-1, 1, isNegative(semitones));
    const width = Math.abs(semitones);
    const harmonic = Math.abs(width) % 12;
    const octave = compose(
      inc,
      Math.floor,
      divC(12),
    )(width);

    const tokens = tokenize(NAMES[harmonic], INTERVAL_REGEX);
    if (!tokens) return EmptyInterval as IntervalProps;

    const { tn, qn, tq, qq } = tokens;

    const quality = tq || qq;
    const num = +(tn || qn) + dec(octave) * 7;
    const name = '' + direction * num + quality;

    return fromName(name);
  }

  function fromNotes(firstNote: InitProp | NoteName, secondNote: InitProp | NoteName): IntervalProps {
    const Letter = NOTE.Letter;
    const midi = NOTE.property('midi');
    const letter = NOTE.property('letter');
    const first = (isObject(firstNote) ? firstNote['name'] : firstNote) as NoteName;
    const second = (isObject(secondNote) ? secondNote['name'] : secondNote) as NoteName;

    if (!isNoteName(first) || !isNoteName(second))
      return IntervalError('InvalidIvlConstructor', { first, second }, EmptyInterval) as IntervalProps;
    const _harmonic = midi(second) - midi(first);
    const harmonic = _harmonic % 12;
    const [l1, l2] = [letter(first), letter(second)];
    const generic = (Letter.toStep(l2) - Letter.toStep(l1) + 8) % 7;
    const _name = eq(harmonic, 12) ? 'P8' : intervalTypeFrom(harmonic, generic);

    const _octave = Math.floor(_harmonic / 12) + 1;
    const tokens = tokenize(_name, INTERVAL_REGEX);

    if (!tokens) return EmptyInterval as IntervalProps;

    const _num = +(tokens['tn'] || tokens['qn']);
    const quality = tokens['tq'] || tokens['qq'];
    const num = dec(_octave) * 7 + _num;
    const name = '' + num + quality;

    return fromName(name);
  }

  if (isIntervalName(prop)) return fromName(prop);

  if (isInteger(prop)) return fromDistance(prop);

  if (isArray(prop) && both(isNoteName(prop[0]), isNoteName(prop[1]))) return fromNotes(prop[0], prop[1]);

  return IntervalError('InvalidIvlConstructor', prop, EmptyInterval) as IntervalProps;
}
