import {
  BaseArray,
  BaseBoolean,
  BaseFunctional,
  BaseLogical,
  BaseMaths,
  BaseRelations,
  BaseTypings,
} from 'ann-music-base';

import { NoteName, NOTE } from 'ann-music-note';

import {
  IntervalAlteration,
  IntervalBuild,
  IntervalChroma,
  IntervalDirection,
  IntervalName,
  IntervalNumber,
  IntervalOctave,
  IntervalProps,
  IntervalQuality,
  IntervalSemitones,
  IntervalSimpleNumber,
  IntervalStep,
  IntervalType,
  IvlInitProp,
} from './types';

import { AUG_REGEX, BASE_QUALITIES, BASE_SIZES, DIM_REGEX, INTERVAL_REGEX } from './theory';

import { Interval } from './properties';

const { isName: isNoteName } = NOTE.Validators;

const { fillStr } = BaseArray;
const { either } = BaseBoolean;
const { compose } = BaseFunctional;
const { and: both } = BaseLogical;
const { dec, divC, inc, modC } = BaseMaths;
const { eq, gt, isNegative, lt } = BaseRelations;
const { isNumber, isArray } = BaseTypings;

export const Validators = {
  isIntervalName: (name: IvlInitProp): name is IntervalName => INTERVAL_REGEX.test(name as IntervalName),
  isPerfect: (quality: string) => eq(quality, 'P'),
  isMajor: (quality: string) => eq(quality, 'M'),
  isMinor: (quality: string) => eq(quality, 'm'),
  isDiminished: (quality: string) => DIM_REGEX.test(quality),
  isAugmented: (quality: string) => AUG_REGEX.test(quality),
  isNoteArray: (notes: NoteName[]) => {
    const [first, second] = notes;
    return isArray(notes) && both(isNoteName(first), isNoteName(second));
  },
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
    return BASE_QUALITIES[step] as IntervalType;
  },
  toSemitones(step: IntervalStep, alt: IntervalAlteration, oct: IntervalOctave) {
    return (BASE_SIZES[step] + alt + 12 * dec(oct)) as IntervalSemitones;
  },
  toChroma(step: IntervalStep, alt: IntervalAlteration, dir: IntervalDirection) {
    const offset = (dir * (BASE_SIZES[step] + alt)) % 12;

    return ((offset + 120) % 12) as IntervalChroma;
  },
};

export function simplify(ivl: IntervalName): IntervalName {
  const interval = Interval({ name: ivl });

  if (!interval.valid) return undefined;

  const { simple, quality } = interval as Partial<IntervalProps>;

  return ('' + simple + quality) as IntervalName;
}

export function invert(ivl: IntervalName): IntervalName {
  const interval = Interval({ name: ivl });

  if (!interval.valid) return undefined;

  const { step, itype, alteration, direction, octave } = interval;

  const invStep = ((7 - step) % 7) as IntervalStep;

  const invAlt = -1 * either(alteration, inc(alteration), eq(itype, 'P'));

  return build({ step: invStep, alteration: invAlt, octave, direction });
}

export const property = (name: string) => (interval: IntervalName) => {
  const ivl = Interval({ name: interval });
  return ivl.valid ? ivl[name] : undefined;
};

export function build(params: IntervalBuild = { octave: 1, direction: 1 }): IntervalName {
  const { step, alteration, octave, direction } = params;
  let { inumber } = params;
  if (step !== undefined) inumber = inc(step) + 7 * dec(octave);
  if (eq(inumber, undefined)) return undefined;
  if (!isNumber(alteration)) return undefined;
  const d = lt(direction, 0) ? '-' : '';
  const itype = BASE_QUALITIES[dec(Math.abs(inumber)) % 7];
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
