import { tokenize } from '@base/strings';
import { compose } from '@base/functional';
import { dec, divC, inc } from '@base/math';
import { eq, isNegative } from '@base/relations';
import { NoteStatic } from '@packages/note/factories';
import { Letter } from '@packages/note/mixins';
import { either } from '@base/boolean';
import { Quality } from './properties';
import {
  INTERVAL_REGEX,
  BASE_INTERVAL_SIZES,
  BASE_INTERVAL_TYPES,
  INTERVAL_CLASSES,
  INTERVAL_NUMBERS,
  INTERVAL_QUALITIES,
  INTERVAL_NAMES,
} from './theory';

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              INTERVAL FACTORIES                         *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

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
const intervalTable = [i0, i1, i2, i3, i4, i5, i6, i7, i8, i9, i10, i11, i12];

const intervalTypeFrom = (harmonic: number, generic: number) => intervalTable[harmonic][generic];

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
  const direction = either(-1, 1, isNegative(num));

  // Simple interval number. Used in compound intervals to know which ivl is added to P8
  const simple = either(num, direction * inc(step), eq(num, 8));

  // Number of octaves Interval spans. For simple it is 1, compound > 1
  const divideBy7 = divC(7);
  const octave = compose(
    Math.ceil,
    divideBy7,
    dec,
    Math.abs,
  )(num);

  // How much is the Interval altered from the base position.
  // Ex: 1) diminished can be -2 (when created from minor) or -1 (from Perfect)
  // Ex: 2) Augmented is altered by +1
  // Ex: 3) Perfect/Major intervals are not altered
  const alteration = Quality.toAlteration(type, quality);

  // We calculate width in semitones by adding alteration value to base interval. If is compound we include those octaves
  const width = BASE_INTERVAL_SIZES[step] + alteration + 12 * dec(octave);
  const semitones = direction * width;

  // Chroma is position of interval among 12 possible in octave
  const offset = (direction * (BASE_INTERVAL_SIZES[step] + alteration)) % 12;

  const chroma = (offset + 12) % 12;

  // Interval class. It is between [0,6]
  const ic = INTERVAL_CLASSES[chroma];

  const name = '' + num + quality;

  const valid = true;

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
    valid,
  });
}

export function createIntervalWithSemitones(semitones: IvlSemitones) {
  const harmonic = semitones % 12;
  const _name = INTERVAL_NAMES[harmonic];
  const _octave = Math.floor(semitones / 12) + 1;
  const tokens = tokenize(_name, INTERVAL_REGEX);

  if (!tokens) return undefined;

  const _num = +(tokens['tn'] || tokens['qn']);
  const quality = tokens['tq'] || tokens['qq'];
  const num = dec(_octave) * 7 + _num;
  const name = '' + num + quality;

  return createIntervalWithName(name);
}

/**
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
 */

export function createIntervalWithNotes(first: string, second: string) {
  const _harmonic = NoteStatic.midi(second) - NoteStatic.midi(first);
  // return createIntervalWithSemitones(_harmonic);
  const harmonic = _harmonic % 12;
  const [l1, l2] = [NoteStatic.letter(first), NoteStatic.letter(second)];
  const generic = (Letter.toStep(l2) - Letter.toStep(l1) + 8) % 7;
  console.log(harmonic, generic);
  const _name = eq(harmonic, 12) ? 'P8' : intervalTypeFrom(harmonic, generic);

  const _octave = Math.floor(_harmonic / 12) + 1;
  const tokens = tokenize(_name, INTERVAL_REGEX);

  if (!tokens) return undefined;

  const _num = +(tokens['tn'] || tokens['qn']);
  const quality = tokens['tq'] || tokens['qq'];
  const num = dec(_octave) * 7 + _num;
  const name = '' + num + quality;

  return createIntervalWithName(name);
}

export const IvlFactory = {
  fromName: createIntervalWithName,
  fromSemitones: createIntervalWithSemitones,
  fromNotes: createIntervalWithNotes,
};
