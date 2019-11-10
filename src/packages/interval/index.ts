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
import { InitProps, NOTE, NoteName } from 'ann-music-note';

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
  inumber: IntervalNumber;
  quality: IntervalQuality;
  alteration: IntervalAlteration;
  step: IntervalStep;
  direction: IntervalDirection;
  itype: IntervalType;
  simple: IntervalSimpleNumber;
  width: IntervalSemitones;
  chroma: IntervalChroma;
  octave: IntervalOctave;
  iclass: IntervalClass;
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
  inumber?: IntervalNumber;
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
   * iclass(a,b) = min((a-b) % 12, (b-a) % 12)
   *
   * @example
   * The iclass between pitch classes 4 and 9 is 5 because 9 − 4 = 5, which is less than: 4 − 9 = −5 ≡ 7 (mod 12)
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
    toAlteration(itype: string, quality: string) {
      const len = quality.length;
      const { isAugmented, isDiminished } = Validators;

      if ('PM'.includes(quality)) return 0;

      if (eq(quality, 'm')) return -1;

      if (isAugmented(quality)) return len;

      if (isDiminished(quality)) return -1 * either(len, inc(len), eq(itype, 'P'));

      return undefined;
    },
    fromQualityTokens(tquality: string, qquality) {
      return (tquality || qquality) as IntervalQuality;
    },
  };

  export const Alteration = {
    toQuality(itype: string, alteration: number) {
      if (eq(0, alteration)) return either('M', 'P', eq(itype, 'M'));

      if (both(eq(-1, alteration), eq(itype, 'M'))) return 'm';

      if (gt(alteration, 0)) return fillStr('A', alteration);

      if (lt(alteration, 0)) return fillStr('d', either(alteration, inc(alteration), eq(itype, 'P')));

      return undefined;
    },
  };

  export const Num = {
    toStep(inumber: IntervalNumber) {
      return compose(
        modC(7),
        dec,
        Math.abs,
      )(inumber) as IntervalStep;
    },
    toOctave(inumber: IntervalNumber) {
      return compose(
        Math.ceil,
        divC(7),
        Math.abs,
      )(inumber) as IntervalOctave;
    },
    toDirection(inumber: IntervalNumber) {
      return either(-1, 1, isNegative(inumber)) as IntervalDirection;
    },
    toSimpleNum(inumber: IntervalNumber, step: IntervalStep, dir: IntervalDirection) {
      return either(inumber, dir * inc(step), eq(inumber, 8)) as IntervalSimpleNumber;
    },
    fromTokens(tnum: string, qnum: string) {
      const inum = +(tnum || qnum);
      return inum as IntervalNumber;
    },
  };

  export const Step = {
    toType(step: IntervalStep) {
      return Theory.BASE_QUALITIES[step] as IntervalType;
    },
    toSemitones(step: IntervalStep, alt: IntervalAlteration, oct: IntervalOctave) {
      return (Theory.BASE_SIZES[step] + alt + 12 * dec(oct)) as IntervalSemitones;
    },
    toChroma(step: IntervalStep, alt: IntervalAlteration, dir: IntervalDirection) {
      const offset = (dir * (Theory.BASE_SIZES[step] + alt)) % 12;

      return ((offset + 120) % 12) as IntervalChroma;
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

    const { step, itype, alteration, direction, octave } = interval;

    const invStep = ((7 - step) % 7) as IntervalStep;

    const invAlt = -1 * either(alteration, inc(alteration), eq(itype, 'P'));

    return build({ step: invStep, alteration: invAlt, octave, direction });
  }

  export const property = (name: string) => (interval: IntervalName) => {
    const ivl = Interval(interval);
    return ivl.valid ? ivl[name] : undefined;
  };

  export function build(params: IntervalBuild = { octave: 1, direction: 1 }): IntervalName {
    let { step, alteration, octave, direction, inumber } = params;
    if (step !== undefined) inumber = inc(step) + 7 * dec(octave);
    if (eq(inumber, undefined)) return undefined;
    if (!isNumber(alteration)) return undefined;
    let d = lt(direction, 0) ? '-' : '';
    const itype = Theory.BASE_QUALITIES[dec(Math.abs(inumber)) % 7];
    return d + inumber + Alteration.toQuality(itype, alteration);
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
  const { toAlteration, fromQualityTokens } = INTERVAL.Quality;
  const { toStep, toOctave, toDirection, toSimpleNum, fromTokens } = INTERVAL.Num;
  const { toType, toSemitones, toChroma } = INTERVAL.Step;
  const { INTERVAL_REGEX, CLASSES, NAMES } = Theory;

  function fromName(src: IntervalName): IntervalProps {
    if (!isIntervalName(src)) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    const tokens = tokenize(src, INTERVAL_REGEX);

    if (!tokens) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    const { tn: tshapeNum, qn: qshapeNum, tq: tshapeQuality, qq: qshapeQuality } = tokens;

    const inumber = fromTokens(tshapeNum, qshapeNum) as IntervalNumber;

    const quality = fromQualityTokens(tshapeQuality, qshapeQuality) as IntervalQuality;

    if (!inumber || quality.length > 2) {
      return IntervalError('InvalidIvlConstructor', src, EmptyInterval) as IntervalProps;
    }

    const step = toStep(inumber) as IntervalStep;

    const itype = toType(step);

    const direction = toDirection(inumber);

    const simple = toSimpleNum(inumber, step, direction);

    const octave = toOctave(inumber) as IntervalOctave;

    const alteration = toAlteration(itype, quality) as IntervalAlteration;

    const semitones = toSemitones(step, alteration, octave);

    const width = (direction * semitones) as IntervalSemitones;

    const chroma = toChroma(step, alteration, direction);

    const iclass = CLASSES[chroma] as IntervalClass;

    const name = `${inumber}${quality}` as IntervalName;

    const valid = true;

    return {
      name,
      inumber,
      quality,
      alteration,
      step,
      itype,
      simple,
      width,
      direction,
      octave,
      chroma,
      iclass,
      valid,
    };
  }

  function fromDistance(distance: IntervalSemitones): IntervalProps {
    if (!isInteger(distance)) {
      return IntervalError('InvalidIvlConstructor', distance, EmptyInterval) as IntervalProps;
    }

    const direction = toDirection(distance);
    const width = Math.abs(distance);
    const harmonic = width % 12;
    const octave = compose(
      inc,
      Math.floor,
      divC(12),
    )(width);

    const tokens = tokenize(NAMES[harmonic], INTERVAL_REGEX);

    if (!tokens) {
      return IntervalError('InvalidIvlConstructor', distance, EmptyInterval) as IntervalProps;
    }

    const { tn, qn, tq, qq } = tokens;

    const quality = fromQualityTokens(tq, qq);
    const inumber = fromTokens(tn, qn) + dec(octave) * 7;
    const name = `${direction * inumber}${quality}`;

    return fromName(name);
  }

  function fromNotes(firstNote: InitProps, secondNote: InitProps): IntervalProps {
    const midi = NOTE.property('midi');
    const first = (isObject(firstNote) ? firstNote.name : firstNote) as NoteName;
    const second = (isObject(secondNote) ? secondNote.name : secondNote) as NoteName;

    if (!isNoteName(first) || !isNoteName(second)) {
      return IntervalError('InvalidIvlConstructor', first, EmptyInterval) as IntervalProps;
    }

    const distance = midi(second) - midi(first);

    return fromDistance(distance);
  }

  if (isIntervalName(prop)) return fromName(prop);

  if (isInteger(prop)) return fromDistance(prop);

  if (isArray(prop) && both(isNoteName(prop[0]), isNoteName(prop[1]))) return fromNotes(prop[0], prop[1]);

  return IntervalError('InvalidIvlConstructor', prop, EmptyInterval) as IntervalProps;
}
