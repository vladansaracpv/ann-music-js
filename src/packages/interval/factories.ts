import { tokenize, fillStr } from '@base/strings';
import { compose } from '@base/functional';
import { CustomError } from '@base/error';
import { dec, divC, inc } from '@base/math';
import { eq, isNegative, lt, gt } from '@base/relations';
import { NoteStatic, Letter, NoteValidator } from '@packages/note/factories';
import { either } from '@base/boolean';
import { and2 as both } from '@base/logical';
import { INTERVAL_REGEX, BASE_INTERVAL_SIZES, BASE_INTERVAL_TYPES, INTERVAL_CLASSES, INTERVAL_NAMES } from './theory';
import { isInteger, isNumber } from '@base/types';

const IntervalError = CustomError('Interval');

const EmptyInterval = {
  name: undefined,
  num: undefined,
  quality: undefined,
  alteration: undefined,
  step: undefined,
  direction: undefined,
  type: undefined,
  simple: undefined,
  semitones: undefined,
  chroma: undefined,
  octave: undefined,
  ic: undefined,
  valid: false,
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *             INTERVAL PROPS - VALIDATORS                 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
export const IntervalValidator = {
  isIntervalName: (name: IvlName) => INTERVAL_REGEX.test(name),
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
    const { isAugmented, isDiminished } = IntervalValidator;

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

export const Interval = (props: IvlInitProps): IvlProps => {
  const { name, semitones, notes } = props;

  const intervalTypeFrom = (harmonic: number, generic: number) => intervalTable[harmonic][generic];

  function createIntervalWithName(interval: IvlName): IvlProps {
    const tokens = tokenize(interval, INTERVAL_REGEX);

    if (!IntervalValidator.isIntervalName(interval))
      return IntervalError('InvalidIvlConstructor', { name: interval }, EmptyInterval);

    const { tn, qn, tq, qq } = tokenize(interval, INTERVAL_REGEX);

    const num = +(tn || qn) as IvlNumber;
    const quality = (tq || qq) as IvlQuality;

    /**
     *  Similar to Note.letter.
     *  Number of steps from first note C to given letter.
     *  Normalized to 1 octave
     */
    const step = (dec(Math.abs(num)) % 7) as IvlStep;

    /**
     *  We use it to store information of interval before being altered: d | A.
     *  Diminished ivl can be from minor or Perfect
     */
    const type = BASE_INTERVAL_TYPES[step] as IvlType;

    // 1: (low, high) and -1: (high, low)
    const direction = either(-1, 1, isNegative(num)) as IvlDirection;

    // Simple interval number. Used in compound intervals to know which ivl is added to P8
    const simple = either(num, direction * inc(step), eq(num, 8)) as IvlSimpleNumber;

    // Number of octaves Interval spans. For simple it is 1, compound > 1
    const divideBy7 = divC(7);
    const octave = compose(
      Math.ceil,
      divideBy7,
      // dec,
      Math.abs,
    )(num) as IvlOctave;

    // How much is the Interval altered from the base position.
    // Ex: 1) diminished can be -2 (when created from minor) or -1 (from Perfect)
    // Ex: 2) Augmented is altered by +1
    // Ex: 3) Perfect/Major intervals are not altered
    const alteration = Quality.toAlteration(type, quality) as IvlAlteration;

    // We calculate width in semitones by adding alteration value to base interval. If is compound we include those octaves
    const width = BASE_INTERVAL_SIZES[step] + alteration + 12 * dec(octave);
    const semitones = (direction * width) as IvlSemitones;

    // Chroma is position of interval among 12 possible in octave
    const offset = (direction * (BASE_INTERVAL_SIZES[step] + alteration)) % 12;

    const chroma = ((offset + 12) % 12) as IvlChroma;

    // Interval class. It is between [0,6]
    const ic = INTERVAL_CLASSES[chroma] as IvlClass;

    const name = ('' + num + quality) as IvlName;

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

  function createIntervalWithSemitones(semitones: IvlSemitones): IvlProps {
    if (!isInteger(semitones)) return IntervalError('InvalidIvlConstructor', { semitones: semitones }, EmptyInterval);

    const direction = either(-1, 1, isNegative(semitones));
    const _semitones = Math.abs(semitones);
    const harmonic = Math.abs(_semitones) % 12;
    const _name = INTERVAL_NAMES[harmonic];
    const _octave = Math.floor(_semitones / 12) + 1;
    const tokens = tokenize(_name, INTERVAL_REGEX);

    if (!tokens) return undefined;

    const _num = +(tokens['tn'] || tokens['qn']);
    const quality = tokens['tq'] || tokens['qq'];
    const num = dec(_octave) * 7 + _num;
    const name = '' + direction * num + quality;

    return createIntervalWithName(name);
  }

  function createIntervalWithNotes(first: NoteName, second: NoteName): IvlProps {
    if (!NoteValidator.isName(first) || !NoteValidator.isName(second))
      return IntervalError('InvalidIvlConstructor', { notes: [first, second] }, EmptyInterval);
    const _harmonic = NoteStatic.midi(second) - NoteStatic.midi(first);
    // return createIntervalWithSemitones(_harmonic);
    const harmonic = _harmonic % 12;
    const [l1, l2] = [NoteStatic.letter(first), NoteStatic.letter(second)];
    const generic = (Letter.toStep(l2) - Letter.toStep(l1) + 8) % 7;
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

  if (name && IntervalValidator.isIntervalName(name)) return createIntervalWithName(name);
  if (semitones && isInteger(semitones)) return createIntervalWithSemitones(semitones);
  if (notes && both(NoteValidator.isName(notes[0]), NoteValidator.isName(notes[1])))
    return createIntervalWithNotes(notes[0], notes[1]);
  return EmptyInterval;
};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                 INTERVAL STATIC METHODS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

function build(params: IvlBuild = { octave: 1, direction: 1 }): IvlName {
  let { step, alteration, octave, direction, num } = params;
  if (step !== undefined) num = inc(step) + 7 * dec(octave);
  if (eq(num, undefined)) return undefined;
  if (!isNumber(alteration)) return undefined;
  let d = lt(direction, 0) ? '-' : '';
  const type = BASE_INTERVAL_TYPES[dec(Math.abs(num)) % 7];
  return d + num + Alteration.toQuality(type, alteration);
}

function simplifyInterval(ivl: IvlName): IvlName {
  const interval = Interval({ name: ivl });

  if (!interval.valid) return undefined;

  const { simple, quality } = interval as Partial<IvlProps>;

  return ('' + simple + quality) as IvlName;
}

function invertInterval(ivl: IvlName): IvlName {
  const interval = Interval({ name: ivl });

  if (!interval.valid) return undefined;

  const { step, type, alteration, direction, octave } = interval;

  const invStep = ((7 - step) % 7) as IvlStep;

  const invAlt = -1 * either(alteration, inc(alteration), eq(type, 'P'));

  return build({ step: invStep, alteration: invAlt, octave, direction });
}

const property = (name: string) => (interval: IvlName) => {
  const ivl = Interval({ name: interval });
  return ivl.valid ? ivl[name] : undefined;
};

export const IntervalStatic = {
  build,
  simplifyInterval,
  invertInterval,
  property,
  name: property('name'),
  num: property('num'),
  quality: property('quality'),
  alteration: property('alteration'),
  step: property('step'),
  direction: property('direction'),
  type: property('type'),
  simple: property('simple'),
  semitones: property('semitones'),
  chroma: property('chroma'),
  octave: property('octave'),
  ic: property('ic'),
};
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
