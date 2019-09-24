import * as Theory from './theory';
import { NOTE, Note } from 'ann-music-note';

import {
  FunctionalBase,
  ErrorBase,
  MathBase,
  TypeCheckBase,
  RelationsBase,
  BooleanBase,
  StringsBase,
  LogicalBase,
  ArraysBase,
} from 'ann-music-base';

const { fillStr } = ArraysBase;

const CustomError = ErrorBase.CustomError;
const { inc, dec, divC } = MathBase;

const { isInteger, isNumber } = TypeCheckBase;

const { compose } = FunctionalBase;

const NoteError = CustomError('Interval');

const { lt, leq, eq, neq, gt, geq, cmp, isNegative, inSegment } = RelationsBase;
const { tokenize, capitalize, substitute } = StringsBase;
const { either } = BooleanBase;
const { and2: both } = LogicalBase;

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                  INTERVAL - INTERFACES                  *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

/** Interval name with shape: number + quality. @example 3M */
type IvlName = string;

/** Generic interval number. Number of diatonic steps between two notes */
type IvlNumber = number;

/** Possible interval qualities */
type IvlQuality = 'd' | 'm' | 'M' | 'P' | 'A';

/** In natural scale, there are just M and P intervals. All other qualities are alterations by some amount */
type IvlAlteration = number;

/** Similar to Note.step. Number of letters from first to second note */
type IvlStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Direction of I(N1, N2) is positive if N1 < N2. Negative otherwise */
type IvlDirection = -1 | 1;

/** Basic interval type derived from natural C-major scale. M => d, m, A; P => d, A */
type IvlType = 'M' | 'P';

/** Simple number is normalized IvlNumber to single octave. M9 => P8 + M2 */
type IvlSimpleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Width of the interval in semitones */
type IvlSemitones = number;

/** Similar to Note.chroma it is an index of interval in list of 12 basic intervals */
type IvlChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** How many octaves does the interval encompass. For simple it is = 1, compound: > 1 */
type IvlOctave = number;

/** Interval class is the minimum distance in steps of I(N1,N2), I(N2, N1) */
type IvlClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface IvlProps {
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
  valid: boolean;
}

/** Interval properties from which the Interval object can be constructed **/
type IvlInitProps = Partial<{
  name: string;
  semitones: number;
  notes: NoteName[];
}>;

interface IvlBuild {
  step?: IvlStep;
  alteration?: IvlAlteration;
  octave?: IvlOctave;
  direction?: IvlDirection;
  num?: IvlNumber;
}
interface IvlBuilderProps {
  distance?: boolean;
  transpose?: boolean;
  compare?: boolean;
}

const Letter = NOTE && NOTE.Letter;
const NValidators = NOTE && NOTE.Validators;
const nproperty = NOTE && NOTE.property;

const midi = nproperty && nproperty('midi');
const letter = nproperty && nproperty('letter');

const IntervalError = CustomError('Interval');

const EmptyInterval: IvlProps = {
  name: '',
  num: -1,
  quality: 'M',
  alteration: 0,
  step: 0,
  direction: 1,
  type: 'M',
  simple: 1,
  semitones: 0,
  chroma: 0,
  octave: 0,
  ic: 0,
  valid: false,
};

/**
 * Note object builder. Used to assign methods beside note properties
 * @param {IvlBuildProps} initProps
 * @param {IvlInitProps} from
 */
function IntervalBuilder(initProps: IvlBuilderProps, from: IvlInitProps) {
  const { distance, transpose, compare } = initProps;
  const ivl = Interval(from);
}

/**
 * Generate Interval static methods
 */
function GenerateIntervalStaticMethods() {
  const Validators = {
    isIntervalName: (name: IvlName) => Theory.INTERVAL_REGEX.test(name),
    isPerfect: (quality: string) => eq(quality, 'P'),
    isMajor: (quality: string) => eq(quality, 'M'),
    isMinor: (quality: string) => eq(quality, 'm'),
    isDiminished: (quality: string) => /^d{1,2}$/.test(quality),
    isAugmented: (quality: string) => /^A{1,2}$/.test(quality),
  };

  const Quality = {
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

  const Alteration = {
    toQuality(type: string, alteration: number) {
      if (eq(0, alteration)) return either('M', 'P', eq(type, 'M'));

      if (both(eq(-1, alteration), eq(type, 'M'))) return 'm';

      if (gt(alteration, 0)) return fillStr('A', alteration);

      if (lt(alteration, 0)) return fillStr('d', either(alteration, inc(alteration), eq(type, 'P')));

      return undefined;
    },
  };

  function simplify(ivl: IvlName): IvlName {
    const interval = Interval({ name: ivl });

    if (!interval.valid) return undefined;

    const { simple, quality } = interval as Partial<IvlProps>;

    return ('' + simple + quality) as IvlName;
  }

  function invert(ivl: IvlName): IvlName {
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

  function build(params: IvlBuild = { octave: 1, direction: 1 }): IvlName {
    let { step, alteration, octave, direction, num } = params;
    if (step !== undefined) num = inc(step) + 7 * dec(octave);
    if (eq(num, undefined)) return undefined;
    if (!isNumber(alteration)) return undefined;
    let d = lt(direction, 0) ? '-' : '';
    const type = Theory.BASE_INTERVAL_TYPES[dec(Math.abs(num)) % 7];
    return d + num + INTERVAL.Alteration.toQuality(type, alteration);
  }

  function intervalTable(harmonic: number, generic: number) {
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

  /**
   *
   * @param {IvlName} i1
   * @param {IvlName} i2
   * @param {boolean} addition - to add or subtract
   * @returns sum or difference of 2 intervals
   */
  function addIntervals(i1: IvlName, i2: IvlName, addition = true): IvlName {
    const ivl1 = Interval({ name: i1 });
    const ivl2 = Interval({ name: i2 });

    const semitones = ivl1.semitones + ivl2.semitones * either(1, -1, addition);

    const interval = Interval({ semitones });

    return interval.valid ? interval.name : undefined;
  }

  /**
   * Add two intervals
   *
   * Can be partially applied.
   *
   * @param {IvlName} interval1
   * @param {IvlName} interval2
   * @return {IvlName} the resulting interval
   */
  function add(...args: IvlName[]) {
    if (args.length === 1) return (i2: IvlName) => addIntervals(args[0], i2);
    return addIntervals(args[0], args[1]);
  }

  /**
   * Subtract two intervals
   *
   * Can be partially applied
   *
   * @param {IvlName} minuend
   * @param {IvlName} subtrahend
   * @return {IvlName} interval diference
   */
  function sub(...args: IvlName[]) {
    if (args.length === 1) return (i2: IvlName) => addIntervals(args[0], i2);
    return addIntervals(args[0], args[1], false);
  }

  return {
    Validators,
    Quality,
    Alteration,
    simplify,
    invert,
    property,
    build,
    intervalTable,
    add,
    sub,
  };
}

export const INTERVAL = {
  Theory,
  build: IntervalBuilder,
  ...GenerateIntervalStaticMethods(),
};

/**
 * Interval factory function
 * @param {IvlInitProps} props
 * @return {IvlProps}
 */
export function Interval(props: IvlInitProps): IvlProps {
  const { name, semitones, notes } = props;
  const IValidators = INTERVAL.Validators;
  const isNoteName = NValidators.isName;

  const intervalTypeFrom = (harmonic: number, generic: number) => INTERVAL.intervalTable(harmonic, generic);

  function createIntervalWithName(interval: IvlName): IvlProps {
    if (!INTERVAL.Validators.isIntervalName(interval))
      return IntervalError('InvalidIvlConstructor', interval, EmptyInterval) as IvlProps;

    const tokens = {
      ...{
        tn: '',
        qn: '',
        tq: '',
        qq: '',
      },
      ...tokenize(interval, Theory.INTERVAL_REGEX),
    };

    const { tn, qn, tq, qq } = tokens;

    const num = +(tn || qn) as IvlNumber;
    const quality = (tq || qq) as IvlQuality;

    /**
     *  Similar to NOTE.letter.
     *  Number of steps from first note C to given letter.
     *  Normalized to 1 octave
     */
    const step = (dec(Math.abs(num)) % 7) as IvlStep;

    /**
     *  We use it to store information of interval before being altered: d | A.
     *  Diminished ivl can be from minor or Perfect
     */
    const type = Theory.BASE_INTERVAL_TYPES[step] as IvlType;

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
    const alteration = INTERVAL.Quality.toAlteration(type, quality) as IvlAlteration;

    // We calculate width in semitones by adding alteration value to base interval. If is compound we include those octaves
    const width = Theory.BASE_INTERVAL_SIZES[step] + alteration + 12 * dec(octave);
    const semitones = (direction * width) as IvlSemitones;

    // Chroma is position of interval among 12 possible in octave
    const offset = (direction * (Theory.BASE_INTERVAL_SIZES[step] + alteration)) % 12;

    const chroma = ((offset + 12) % 12) as IvlChroma;

    // Interval class. It is between [0,6]
    const ic = Theory.INTERVAL_CLASSES[chroma] as IvlClass;

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
    if (!isInteger(semitones)) return IntervalError('InvalidIvlConstructor', '' + semitones, EmptyInterval) as IvlProps;

    const direction = either(-1, 1, isNegative(semitones));
    const _semitones = Math.abs(semitones);
    const harmonic = Math.abs(_semitones) % 12;
    const _name = Theory.INTERVAL_NAMES[harmonic];
    const _octave = Math.floor(_semitones / 12) + 1;
    const tokens = tokenize(_name, Theory.INTERVAL_REGEX);

    if (!tokens) return undefined;

    const _num = +(tokens['tn'] || tokens['qn']);
    const quality = tokens['tq'] || tokens['qq'];
    const num = dec(_octave) * 7 + _num;
    const name = '' + direction * num + quality;

    return createIntervalWithName(name);
  }

  function createIntervalWithNotes(first: NoteName, second: NoteName): IvlProps {
    if (!NValidators.isName(first) || !NValidators.isName(second))
      return IntervalError(
        'InvalidIvlConstructor',
        'first: ' + first + ', second: ' + second,
        EmptyInterval,
      ) as IvlProps;
    const _harmonic = midi({ name: second }) - midi({ name: first });
    // return createIntervalWithSemitones(_harmonic);
    const harmonic = _harmonic % 12;
    const [l1, l2] = [letter({ name: first }), letter({ name: second })];
    const generic = (Letter.toStep(l2) - Letter.toStep(l1) + 8) % 7;
    const _name = eq(harmonic, 12) ? 'P8' : intervalTypeFrom(harmonic, generic);

    const _octave = Math.floor(_harmonic / 12) + 1;
    const tokens = tokenize(_name, Theory.INTERVAL_REGEX);

    if (!tokens) return undefined;

    const _num = +(tokens['tn'] || tokens['qn']);
    const quality = tokens['tq'] || tokens['qq'];
    const num = dec(_octave) * 7 + _num;
    const name = '' + num + quality;

    return createIntervalWithName(name);
  }

  if (name && IValidators.isIntervalName(name)) return createIntervalWithName(name);

  if (semitones && isInteger(semitones)) return createIntervalWithSemitones(semitones);

  if (notes && both(isNoteName(notes[0]), isNoteName(notes[1]))) return createIntervalWithNotes(notes[0], notes[1]);

  return EmptyInterval as IvlProps;
}
