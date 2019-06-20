import { fillStr } from '@base/strings';
import { CustomError } from '@base/error';
import { and2 as both } from '@base/logical';
import { dec, inc } from '@base/math';
import { eq, lt, gt } from '@base/relations';
import { isNumber } from '@base/types';
import { either } from '@base/boolean';
import { BASE_INTERVAL_TYPES } from './theory';
import { Factory } from './factories';

const IntervalError = CustomError('Factory');
/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              INTERVAL PROPS - VALIDATORS                *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export const Validators = {
  isPerfect: (quality: string) => eq(quality, 'P'),
  isMajor: (quality: string) => eq(quality, 'M'),
  isMinor: (quality: string) => eq(quality, 'm'),
  isDiminished: (quality: string) => /^d{1,2}$/.test(quality),
  isAugmented: (quality: string) => /^A{1,2}$/.test(quality),
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              INTERVAL PROPS - HELPER FUNCTIONS          *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

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

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                INTERVAL - FUNCTIONS                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export function build({ step = 0, alteration = 0, octave = 4, direction = 1, num = 0 }) {
  if (step !== undefined) num = inc(step) + 7 * dec(octave);
  if (eq(num, undefined)) return undefined;
  if (!isNumber(alteration)) return undefined;
  let d = !isNumber(direction) ? '' : lt(direction, 0) ? '-' : '';
  const type = BASE_INTERVAL_TYPES[dec(Math.abs(num)) % 7];
  return d + num + Alteration.toQuality(type, alteration);
}

export function simplifyInterval(ivl: string) {
  const interval = Factory.fromName(ivl);

  if (!interval) return IntervalError('InvalidIvlName', ivl);

  const { simple, quality } = interval as Partial<IvlProps>;

  return '' + simple + quality;
}

export function invertInterval(ivl: string) {
  const interval = Factory.fromName(ivl) as IvlProps;

  if (!interval) return IntervalError('InvalidIvlName', ivl);

  const { step, type, alteration, direction, octave } = interval;

  const invStep = (7 - step) % 7;

  const invAlt = -1 * either(alteration, inc(alteration), eq(type, 'P'));

  return build({ step: invStep, alteration: invAlt, octave, direction });
}

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * *            INTERVAL PROPS - GETTERS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const property = (name: string) => (interval: IvlName) =>
  Factory.fromName(interval) && Factory.fromName(interval)[name];

export const name = property('name');

export const num = property('num');

export const quality = property('quality');

export const alteration = property('alteration');

export const step = property('step');

export const direction = property('direction');

export const type = property('type');

export const simple = property('simple');

export const semitones = property('semitones');

export const chroma = property('chroma');

export const octave = property('octave');

export const ic = property('ic');
