import { tokenize } from '@base/strings';
import { compose } from '@base/functional';
import { dec, divC, mul2, inc } from '@base/math';
import { eq, lt } from '@base/relations';
import { midi } from '@packages/note/properties';
import { either } from '@base/boolean';
import { Quality } from './properties';
import {
  INTERVAL_REGEX,
  BASE_INTERVAL_SIZES,
  BASE_INTERVAL_TYPES,
  INTERVAL_CLASSES,
  INTERVAL_NUMBERS,
  INTERVAL_QUALITIES,
} from './theory';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              INTERVAL FACTORIES                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export function createIntervalWithName(interval: IvlName) {
  const tokens = tokenize(interval, INTERVAL_REGEX);

  if (!tokens) return undefined;

  // IntervalError('InvalidIvlName', name);
  const num = +(tokens['tn'] || tokens['qn']);
  const quality = tokens['tq'] || tokens['qq'];

  // Similar to Note.letter.
  // Number of steps from first note C to given letter.
  // Normalized to 1 octave
  const step = dec(Math.abs(num)) % 7;

  // We use it to store information of interval before being altered: d | A. Diminished ivl can be from minor or Perfect
  const type = BASE_INTERVAL_TYPES[step];

  // 1: (low, high) and -1: (high, low)
  const direction = either(-1, 1, lt(num, 0));

  // Simple interval number. Used in compound intervals to know which ivl is added to P8
  const simple = either(num, direction * inc(step), eq(num, 8));

  // Number of octaves Interval spans. For simple it is 1, compound > 1
  const octave = compose(...[Math.ceil, divC(7), dec, Math.abs])(num);

  // How much is the Interval altered from the base position.
  // Ex: 1) diminished can be -2 (when created from minor) or -1 (from Perfect)
  // Ex: 2) Augmented is altered by +1
  // Ex: 3) Perfect/Major intervals are not altered
  const alteration = Quality.toAlteration(type, quality);

  // We calculate width in semitones by adding alteration value to base interval. If is compound we include those octaves
  const width = BASE_INTERVAL_SIZES[step] + alteration + 12 * dec(octave);
  const semitones = mul2(direction, width);

  // Chroma is position of interval among 12 possible in octave
  const offset = (direction * (BASE_INTERVAL_SIZES[step] + alteration)) % 12;

  const chroma = (offset + 12) % 12;

  // Interval class. It is between [0,6]
  const ic = INTERVAL_CLASSES[chroma];

  const name = '' + num + quality;

  return Object.freeze({
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
  });
}

export function createIntervalWithSemitones(semitones: IvlSemitones) {
  const direction = either(-1, 1, lt(semitones, 0));
  const distance = Math.abs(semitones);
  const chroma = distance % 12;
  const octave = Math.floor(distance / 12);
  const number = direction * (INTERVAL_NUMBERS[chroma] + 7 * octave);
  const name = '' + number + INTERVAL_QUALITIES[chroma];
  return createIntervalWithName(name);
}

export function createIntervalWithNotes(first: string, second: string) {
  const distanceInSemitones = midi(second) - midi(first);
  return createIntervalWithSemitones(distanceInSemitones);
}

export const Interval = {
  fromName: createIntervalWithName,
  fromSemitones: createIntervalWithSemitones,
  fromNotes: createIntervalWithNotes,
};
