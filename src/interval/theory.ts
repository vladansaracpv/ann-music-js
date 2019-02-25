import { divC, mod, sub, subC, addC, add, addN, isEither, isNumber, isString, fillStr, isIn, compose, eq, neq, gt, lt, lor, land, glue, mulC, mul } from '../helpers';
import { midi } from '../note/properties';

type IntervalName = string;
type IntervalQuality = 'dddd' | 'ddd' | 'dd' | 'd' | 'm' | 'M' | 'P' | 'A' | 'AA' | 'AAA' | 'AAAA';
type IntervalAlteration = number;
type IntervalStep = number;
type IntervalDirection = 1 | -1;
type IntervalSimplifiedNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type IntervalType = 'P' | 'M';
type IntervalChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
type IntervalClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface IntervalProps {
  name: IntervalName;
  number: number;
  quality: IntervalQuality;
  step: IntervalStep;
  alteration: IntervalAlteration;
  direction: IntervalDirection;
  type: IntervalType;
  simple: IntervalSimplifiedNumber;
  semitones: number;
  chroma: IntervalChroma;
  octave: number;
  ic: IntervalClass;
};

interface NoIntervalProps {
  name: null;
  number: null;
  quality: null;
  step: null;
  alteration: null;
  direction: null;
  type: null;
  simple: null;
  semitones: null;
  chroma: null;
};

export const NO_INTERVAL = Object.freeze({
  name: null,
  number: null,
  quality: null,
  step: null,
  alteration: null,
  direction: null,
  type: null,
  simple: null,
  semitones: null,
  chroma: null,
  octave: null
} as NoIntervalProps);

export const KEYS = [
  'name',
  'number',
  'quality',
  'step',
  'alteration',
  'direction',
  'type',
  'simple',
  'semitones',
  'chroma',
  'octave'
];

const isPerfect = (type: string, quality: string) => land(eq(quality, 'P'), eq(type, 'P'));
const isP8 = (number: number) => eq(8, Math.abs(number))
const isMajor = (type: string, quality: string) => land(eq(quality, 'M'), eq(type, 'M'));
const isMinor = (type: string, quality: string) => land(eq(quality, 'm'), eq(type, 'M'));
const isAugmented = (quality: string) => /^A+$/.test(quality);
const isDiminished = (quality: string) => /^d+$/.test(quality);
const perfectIvlLength = (type: string, quality: string) => isEither(-quality.length, -add1(quality.length), eq(type, 'P'));

const getStepFromNumber = (num: number) => compose(mod7, decrement, Math.abs)(num);
const getTypeAtStep = (step: number): IntervalType => TYPES[step] as IntervalType;
const getDirectionFromNumber = (number: number): IntervalDirection => isEither(-1, 1, lt(0, number));

const add1 = addC(1);
const add12 = addC(12);
const sub1 = subC(1);
const decrement = subC(1);
const div12 = divC(12);
const div7 = divC(7);
const mul12 = mulC(12);
const mul7 = mulC(7);
const mod7 = mod(7);
const mod12 = mod(12);

const cache = {} as { [key: string]: IntervalProps | NoIntervalProps };

const INTERVAL_TONAL = '([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})';
const INTERVAL_QUALITY = '(AA|A|P|M|m|d|dd)([-+]?\\d+)';
const REGEX = new RegExp(`^${INTERVAL_TONAL}|${INTERVAL_QUALITY}$`);

export const SIZES = [0, 2, 4, 5, 7, 9, 11];
export const TYPES = 'PMMPPMM';
export const CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0];
export const NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');
export const IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
export const IQ = 'P m M m M P d P m M m M'.split(' ');

export const names = (qualities?: IntervalName | IntervalName[]) => {
  return isString(qualities)
    ? NAMES.filter(isIn(qualities))
    : [...NAMES]
}

export const parseInterval = (str?: IntervalName) => {
  const m = REGEX.exec(str) as string[];
  if (!m) return null;
  return isEither([m[1], m[2]], [m[4], m[3]], m[1]) as [string, string];
};

export const qualityToAlteration = (type: string, quality: string) => {
  if (isPerfect(type, quality)) return 0;
  if (isMajor(type, quality)) return 0;
  if (isMinor(type, quality)) return -1;
  if (isAugmented(quality)) return quality.length;
  if (isDiminished(quality)) return perfectIvlLength(type, quality);
  return null;
};

export const qualityFromAlteration = (type: string, alteration: number) => {
  if (eq(0, alteration)) return isEither('M', 'P', eq(type, 'M'));
  if (land(eq(-1, alteration), eq(type, 'M'))) return 'm';
  if (gt(0, alteration)) return fillStr('A', alteration);
  if (lt(0, alteration)) return fillStr('d', isEither(alteration, add1(alteration), eq(type, 'P')));
  return null;
};

const getIntervalWidth = (step: number, alteration: number, octave: number) => addN(SIZES[step], alteration, mul12(octave));

const properties = (str?: string) => {
  const t = parseInterval(str);
  if (!t) return NO_INTERVAL;
  const [number, quality] = t;

  const p = {
    number: 0,
    quality: 'd',
    name: '',
    type: 'M',
    step: 0,
    direction: -1,
    simple: 1,
    alteration: 0,
    octave: 0,
    semitones: 0,
    chroma: 0,
    ic: 0
  } as IntervalProps;

  p.number = +number;
  p.quality = quality as IntervalQuality;
  p.step = getStepFromNumber(p.number);
  p.type = getTypeAtStep(p.step);
  if (land(eq(p.type, 'M'), eq(p.quality, 'P'))) return NO_INTERVAL;
  p.name = glue('', p.number, p.quality);
  p.direction = getDirectionFromNumber(p.number);
  p.simple = isEither(
    p.number,
    mul(p.direction, add1(p.step)),
    isP8(p.number)
  ) as IntervalSimplifiedNumber;
  p.alteration = qualityToAlteration(p.type, p.quality) as number;
  p.octave = compose(Math.floor, div7, sub1, Math.abs)(p.number)
  p.semitones = mul(p.direction, getIntervalWidth(p.step, p.alteration, p.octave));
  const a = mod12(mul(p.direction, add(SIZES[p.step], p.alteration)));
  p.chroma = compose(mod12, add12)(a) as IntervalChroma;
  return Object.freeze(p);
};

export const getIntervalProps = (str?: string) => {
  if (!isString(str)) return NO_INTERVAL;
  return cache[str] || (cache[str] = properties(str));
};

export const number = (str: IntervalName) => getIntervalProps(str).number;
export const name = (str: IntervalName) => getIntervalProps(str).name;
export const semitones = (str: IntervalName) => getIntervalProps(str).semitones;
export const chroma = (str: IntervalName) => getIntervalProps(str).chroma;
export const ic = (ivl?: IntervalName | IntervalStep | null) => {
  let ivlClass = ivl;
  if (isString(ivl)) ivlClass = getIntervalProps(ivl.toString()).chroma;
  return isEither(CLASSES[mod12(+ivlClass)], null, isNumber(ivlClass));
};

export const build = ({ number, step, alteration, octave = 1, direction } = {} as Partial<IntervalProps>) => {
  if (neq(step, undefined)) number = addN(step, 1, mul7(octave));
  if (eq(number, undefined)) return null;
  if (!isNumber(alteration)) return null;
  let d = isEither('', isEither('-', '', lt(0, direction)), !isNumber(direction));
  const type = TYPES[getStepFromNumber(number)];
  return glue(d, number, qualityFromAlteration(type, alteration)) as IntervalName;
};

export const simplify = (str: IntervalName) => {
  const props = getIntervalProps(str);
  if (props === NO_INTERVAL) return null;
  const { simple, quality } = props as Partial<IntervalProps>;

  return glue('', simple, quality);
};

export const invert = (str: IntervalName) => {
  const props = getIntervalProps(str) as IntervalProps;
  if (props === NO_INTERVAL) return null;
  const { step, type, alteration, direction, octave } = props;
  const invStep = mod7(sub(7, step));
  const invAlt = isEither(-alteration, -add1(alteration), eq(type, 'P'));
  return build({ step: invStep, alteration: invAlt, octave, direction });
};


const widthInOctaves = (distance: number) => compose(Math.floor, div12)(distance);
const widthInSemitones = (semitones: number) => Math.abs(semitones);
const chromaFromWidth = (distance: number) => mod12(distance);
const numberForOffset = (direction: number, chroma: number, octave: number) => mul(direction, add(IN[chroma], mul7(octave)));
const getIntervalFrom = (number: number, quality: string) => glue('', number, quality);

export const fromSemitones = (semitones: number): string => {
  const [direction, distance] = [getDirectionFromNumber(semitones), widthInSemitones(semitones)];
  const [chroma, octave] = [chromaFromWidth(distance), widthInOctaves(distance)];
  const number = numberForOffset(direction, chroma, octave);
  return getIntervalFrom(number, IQ[chroma])
};

const distance = (a, b, fn = midi) => Math.abs(fn(b) - fn(a));

export const cents = (freq1: number, freq2: number): number => (
  eq(0, freq1)
    ? null
    : 1200 * Math.log2(freq2 / freq1)
);

export const chromatic = (a: string, b: string): any => ({
  number: distance(a, b),
  name: glue('i', distance(a, b))
});

export const generic = (a: string, b: string): any => ({

});

// Pitch: C#4, D3, C4...
// Pitch Space: C#2, D4, Bb2, ...
// Pitch Class: C, F#, G, ..., B
// Pitch class space: [0, ..., 11]
// Octave equivalence: C3 = C4
// Enharmonic equivalence: C#3 = Db3

/**
 *
 *  Pitch Interval: pi<G4, A#5> = 15
 *   - Ordered
 *      opi<G4, A#5> = 15
 *      opi<A#5, G4> = -15
 *   - Unordered
 *      upi<G4><A#4> = min(G4-A#5, A#5-G4) % 12
 * 
 *  Pitch Class Interval pci<G4, A#5> = pci<G, A#> = 3
 *   - Ordered
 *      opci<G, A#> = 3
 *      opci<A#, G> = 9
 *   - Unordered
 *      upci<G, A#> = min(opci<G,A#>, opci<A#, G>) = 3
 * 
 */


console.log(getIntervalProps('6m'));

// console.log(cents(400, 520))
// console.log(chromatic('C4', 'A4'))
