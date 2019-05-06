// /**
//  * IntervalName: string
//  *
//  *  Name of the interval. Can be of 2 types:
//  *  - number + quality: 3M
//  *  - quality + number: M3
//  */
// type IntervalName = string;

// /**
//  * IntervalQuality: string
//  *
//  *  Quality can be:
//  *  - diminished (one or multiple times)
//  *  - minor
//  *  - Major
//  *  - Perfect
//  *  - Augmented (one or multiple times)
//  *
//  *  As interval can be diminished/Augmented multiple times,
//  *  we put constraint on max. 4 times
//  */
// type IntervalQuality =
//     | 'dddd'
//     | 'ddd'
//     | 'dd'
//     | 'd'
//     | 'm'
//     | 'M'
//     | 'P'
//     | 'A'
//     | 'AA'
//     | 'AAA'
//     | 'AAAA';

// /**
//  * IntervalAlteration: number
//  *
//  *  Amount of semitones that the interval is altered
//  *  from the natural one (interval with only natural tones)
//  */
// type IntervalAlteration = number;

// /**
//  * IntervalStep: number
//  *
//  *  How many steps from the root tone of the diatonic major scale
//  *  does this interval encompass.
//  *
//  *  Ex: C-G is M5. IntervalStep is 4.
//  *      - 1 steps from C to D: C-D
//  *      - 2 steps from C to E: C-D-E
//  *      - 3 steps from C to F: C-D-E-F
//  *      - 4 steps from C to G: C-D-E-F-G
//  */
// type IntervalStep = number;

// /**
//  * IntervalDirection
//  *
//  *  It shows wether tones in interval are ordered from
//  *  - lower  => higher (+1)
//  *  - higher => lower  (-1)
//  */
// type IntervalDirection = 1 | -1;

// /**
//  * IntervalSimplifiedNumber
//  *
//  *  Represents generic interval, or number of scale steps
//  *  that interval contains.
//  *
//  *  Ex: M5 = m5 = A5 = 5 as all contain 5 scale steps.
//  */
// type IntervalSimplifiedNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// /**
//  * IntervalType
//  *
//  *  Diatonic major scale has only Perfect and Major intervals.
//  *  All the other scales are made from major diatonic scale and
//  *  their intervals are just different qualities of these basic types
//  */
// type IntervalType = 'P' | 'M';

// /**
//  * IntervalChroma
//  *
//  * The chroma is a number between 0 and 7
//  * that represents the position within an octave (pitch set)
//  *  0 1 2 3 4 5 6 7
//  *  C D E F G A B C
//  *
//  *  Ex: chroma(m2) = 1 as the index of the generic second is 1.
//  *
//  */
// type IntervalChroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

// /**
//  * IntervalClass
//  *
//  *  It is the shortest distance between notes in an unordered interval.
//  *  Maximum value is 6. As for distance 7, we can go the other way around in less steps - 5
//  *
//  *  Ex: ic(C,G) = min(i(C,G), i(G,C)) = min(7, 5) = 5
//  */
// type IntervalClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// /**
//  * IntervalProps
//  *
//  *  Interval properties
//  */
// type IntervalProps = {
//     name: IntervalName;
//     num: number;
//     q: IntervalQuality;
//     step: IntervalStep;
//     alt: IntervalAlteration;
//     dir: IntervalDirection;
//     type: IntervalType;
//     simple: IntervalSimplifiedNumber;
//     semitones: number;
//     chroma: IntervalChroma;
//     oct: number;
//     ic: IntervalClass;
// };

// /**
//  *  NoIntervalProps
//  *
//  *  Empty Interval properties object
//  */
// type NoIntervalProps = {
//     name: null;
//     num: null;
//     q: null;
//     step: null;
//     alt: null;
//     dir: null;
//     type: null;
//     simple: null;
//     semitones: null;
//     chroma: null;
// };

// /**
//  *  NO_INTERVAL
//  *
//  *  Immutable constant of empty interval properties object
//  */
// const NO_INTERVAL = Object.freeze({
//     name: null,
//     num: null,
//     q: null,
//     step: null,
//     alt: null,
//     dir: null,
//     type: null,
//     simple: null,
//     semitones: null,
//     chroma: null,
//     oct: null
// } as NoIntervalProps);

// /**
//  * Properties of Interval object
//  *
//  * - name: Interval name. Consists of [number, quality]. Ex: 3M or M3 for (M)ajor (3)Third
//  * - num:  Interval number. Number of the scale steps that interval is made of
//  * - q:    Interval quality. [perfect, minor, major, augmented, diminished]
//  * - step: Number of scale steps from the root note. Zero based.
//  * - alt:  Number of semitones that the note is altered from the natural tone position
//  * - dir:  Interval direction. If the first note is lower than the second, direction is +, else -
//  * - type: Interval type. Is the base interval in the C-major scale a Perfect or Major interval?
//  * - simple: Simple interval. It is the position of the note in the scale. From 1 to 8.
//  * - semitones: Interval width in semitones.
//  * - chroma: Interval chroma. Index of the interval in the list of 12 possible chromatic intervals.
//  * - oct: Number of octaves that the interval spans.
//  */
// const KEYS = [
//     'name',
//     'num',
//     'q',
//     'step',
//     'alt',
//     'dir',
//     'type',
//     'simple',
//     'semitones',
//     'chroma',
//     'oct'
// ];

// /**
//  * Regex string for intervals in tonal notation.
//  * Number comes before quality
//  *
//  *  Ex: 2M, 3P, 6m, ...
//  */
// const INTERVAL_TONAL = '([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})';

// /**
//  * Regex string for intervals in alternate notation.
//  * Quality comes before number
//  *
//  *  Ex: M2, P3, m6, ...
//  */
// const INTERVAL_QUALITY = '(AA|A|P|M|m|d|dd)([-+]?\\d+)';

// /**
//  * Regular expression for detecting interval in one of two notations
//  */
// const REGEX = new RegExp(`^${INTERVAL_TONAL}|${INTERVAL_QUALITY}$`);

// /**
//  * Sizes of intervals in diatonic major scale.
//  * [0, 2, 4, 5, 7, 9, 11]
//  * [C, D, E, F, G, A, B ]
//  *
//  * Ex: C-E = SIZES[SIZES.indexOf('E')] = 4
//  */
// const SIZES = [0, 2, 4, 5, 7, 9, 11];

// /**
//  * Quality of intervals in diatonic major scale
//  */
// const TYPES = 'PMMPPMM';

// /**
//  * Interval classes for tones in chromatic scale.
//  */
// const CLASSES = [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0];

// /**
//  * Basic intervals in an octave of diatonic scale.
//  * We remember there are only P(erfect) and M(ajor) ones.
//  * Also every Major interval has minor interval one semistep behind it
//  *
//  *  Ex: C - - D - - E - F - - G - - A - - B - C
//  *      P  m  M  m  M - P  *  P  m  M  m  M - P
//  */
// export const NAMES = '1P 2m 2M 3m 3M 4P A4 5P 6m 6M 7m 7M 8P'.split(' ');

// /**
//  * List basic (perfect, major, minor) interval names within a octave
//  * @param {String} qualities - (Optional, default "PMm") the valid types
//  * @return {Array} the interval names
//  * @example
//  * Interval.names() // => [ "1P", "2m", "2M", "3m", "3M", "4P", "5P", "6m", "6M", "7m", "7M", "8P" ]
//  * Interval.names("P") // => [ "1P", "4P", "5P", "8P" ]
//  * Interval.names("PM") // => [ "1P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
//  * Interval.names("Pm") // => [ "1P", "2m", "3m", "4P", "5P", "6m", "7m", "8P" ]
//  * Interval.names("d") // => []
//  */
// const isIn = str => n => str.includes(n[1]);
// export const names = (qualities?: IntervalName | IntervalName[]) =>
//     isString(qualities)
//         ? NAMES.filter(isIn(qualities))
//         : NAMES.slice();

// /**
//  * Tokenizes interval name into array of [number, quality]
//  */
// export const parseInterval = (str?: IntervalName) => {
//     const m = REGEX.exec(str) as string[];
//     if (m === null) return null;
//     return (m[1] ? [m[1], m[2]] : [m[4], m[3]]) as [string, string];
// };

// /**
//  * Helper function for creating string of length @n of string @s
//  * @param {String} s - String to create array from
//  * @param {Number} n - Length of array
//  * @return {String}
//  *
//  * @example
//  *  fillStr('c', 5)  // 'ccccc'
//  *  fillStr('ga', 3) // 'gagaga'
//  */
// const fillStr = (s: string, n: number) => Array(Math.abs(n) + 1).join(s);

// /**
//  * Returns alteration from quality. Remember the rules for qualities:
//  *  1) d < m < M < A
//  *  2) d < P < A
//  * We can calculate alteration now with
//  * @param {String} type - Base type (Major, Perfect)
//  * @param {String} q - Quality (diminished, minor, Major, Perfect, Augmented)
//  * @return {Number}
//  * @example
//  *  qToAlt('M', 'dd') // -3
//  *  qToAlt('M', 'd')  // -2
//  *  qToAlt('M', 'm')  // -1
//  *  qToAlt('M', 'A')  //  1
//  *  qToAlt('P', 'dd') // -2
//  */
// const isMajorIvl = (type, quality) => quality === 'M' && type === 'M';
// const isPerfectIvl = (type, quality) => quality === 'P' && type === 'P';
// const isMinorIvl = (type, quality) => quality === 'm' && type === 'M';
// const isAugmentedIvl = quality => /^A+$/.test(quality);
// const isDiminishedIvl = quality => /^d+$/.test(quality);
// const perfectIvlLength = (type, quality) => type === 'P' ? -quality.length : -quality.length - 1;

// export const qToAlt = (type: string, q: string) => {
//     if (isMajorIvl(type, q)) return 0;
//     if (isPerfectIvl(type, q)) return 0;
//     if (isMinorIvl(type, q)) return -1;
//     if (isAugmentedIvl(q)) return q.length;
//     if (isDiminishedIvl(q)) return perfectIvlLength(type, q);
//     return null;
// };

// /**
//  * Returns quality from alteration
//  * @param {String} type - Base type (Major, Perfect)
//  * @param {Number} alt - Alteration
//  * @return {Number}
//  * @example
//  *  altToQ('M', -1)  // m
//  *  altToQ('P', -2)  // dd
//  *  altToQ('M', -3)  // dd
//  */
// const either = (a, b, c) => c ? a : b;
// export const altToQ = (type: string, alt: number) => {
//     if (alt === 0) return either('M', 'P', type === 'M');
//     if (alt === -1 && type === 'M') return 'm';
//     if (alt > 0) return fillStr('A', alt);
//     if (alt < 0) return fillStr('d', either(alt, alt + 1, type === 'P'));
//     return null;
// };

// /**
//  * Relation between interval number and number of scale steps from root note.
//  * As the number of scale steps from C to C is 0, and interval number for C-C = P1 is 1
//  * we substract 1 to get step from num
//  */
// const numToStep = (num: number) => (Math.abs(num) - 1) % 7;

// const stepToType = (step: number): IntervalType => TYPES[step] as IntervalType;

// const numToDir = (num: number): IntervalDirection => (num < 0 ? -1 : 1);

// const properties = (str?: string) => {
//     // Tokenize interval string to number and quality
//     const t = parseInterval(str);
//     // If there's no number or quality, then we have no interval
//     if (t === null) return NO_INTERVAL;
//     const [number, quality] = t;
//     // Assign initial props for interval of width: 0
//     const p = {
//         num: 0,
//         q: 'd',
//         name: '',
//         type: 'M',
//         step: 0,
//         dir: -1,
//         simple: 1,
//         alt: 0,
//         oct: 0,
//         semitones: 0,
//         chroma: 0,
//         ic: 0
//     } as IntervalProps;

//     // We got interval by tokenization
//     const toInt = s => +s;
//     p.num = toInt(number);

//     // We get quality by tokenization
//     p.q = quality as IntervalQuality;

//     // Calculate step from number
//     p.step = numToStep(p.num);

//     // Calculate base interval type
//     p.type = stepToType(p.step);

//     // There can not be Perfect Major interval
//     if (p.type === 'M' && p.q === 'P') return NO_INTERVAL;

//     // Calculate name from number and quality
//     p.name = '' + p.num + p.q;

//     // Direction is positive if the interval number is positive.
//     p.dir = numToDir(p.num);

//     // Generic interval.
//     p.simple = (p.num === 8 || p.num === -8
//         ? p.num
//         : p.dir * (p.step + 1)) as IntervalSimplifiedNumber;

//     // Calculate alteration
//     p.alt = qToAlt(p.type, p.q) as number;

//     // No. octaves that interval spans.
//     const sub1 = n => n - 1;
//     const div7 = n => n / 7;
//     const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
//     p.oct = compose(Math.floor, div7, sub1, Math.abs)(p.num)

//     p.semitones = p.dir * (SIZES[p.step] + p.alt + 12 * p.oct);
//     const add12 = n => n + 12;
//     const a = mod12(p.dir * (SIZES[p.step] + p.alt));
//     const b = mod12(add12(a));
//     p.chroma = b as IntervalChroma;
//     return Object.freeze(p);
// };

// const cache = {} as { [key: string]: IntervalProps | NoIntervalProps };
// /**
//  * Get interval properties. It returns an object with:
//  *
//  * - name: name
//  * - num: number
//  * - q: quality
//  * - step: step
//  * - alt: alteration
//  * - dir: direction (1 ascending, -1 descending)
//  * - type: "P" or "M" for perfectable or majorable
//  * - simple: the simplified number
//  * - semitones: the size in semitones
//  * - chroma: the interval chroma
//  * - ic: the interval class
//  *
//  * @function
//  * @param {String} interval - the interval
//  * @return {Object} the interval in the form [number, alt]
//  */
// export const getIntervalProps = (str?: string) => {
//     if (typeof str !== 'string') return NO_INTERVAL;
//     return cache[str] || (cache[str] = properties(str));
// };

// /**
//  * Get the number of the interval
//  *
//  * @function
//  * @param {String} interval - the interval
//  * @return {Integer}
//  * @example
//  * Interval.num("m2") // => 2
//  * Interval.num("P9") // => 9
//  * Interval.num("P-4") // => -4
//  */
// export const num = (str: IntervalName) => getIntervalProps(str).num;

// /**
//  * Get interval name. Can be used to test if it"s an interval. It accepts intervals
//  * as pitch or string in shorthand notation or tonal notation. It returns always
//  * intervals in tonal notation.
//  *
//  * @function
//  * @param {String} interval - the interval string or array
//  * @return {String} the interval name or null if not valid interval
//  * @example
//  * Interval.name("m-3") // => "-3m"
//  * Interval.name("3") // => null
//  */
// export const name = (str: IntervalName) => getIntervalProps(str).name;

// /**
//  * Get size in semitones of an interval
//  *
//  * @function
//  * @param {String} ivl
//  * @return {Integer} the number of semitones or null if not an interval
//  * @example
//  * import { semitones } from "tonal-interval"
//  * semitones("P4") // => 5
//  * // or using tonal
//  * Tonal.Interval.semitones("P5") // => 7
//  */
// export const semitones = (str: IntervalName) => getIntervalProps(str).semitones;

// /**
//  * Get the chroma of the interval. The chroma is a number between 0 and 7
//  * that represents the position within an octave (pitch set)
//  *
//  * @function
//  * @param {String} str
//  * @return {Number}
//  */
// export const chroma = (str: IntervalName) => getIntervalProps(str).chroma;

// /**
//  * Get the [interval class](https://en.wikipedia.org/wiki/Interval_class)
//  * number of a given interval.
//  *
//  * In musical set theory, an interval class is the shortest distance in
//  * pitch class space between two unordered pitch classes
//  *
//  * @function
//  * @param {String|Integer} interval - the interval or the number of semitones
//  * @return {Integer} A value between 0 and 6
//  *
//  * @example
//  * Interval.ic("P8") // => 0
//  * Interval.ic("m6") // => 4
//  * Interval.ic(10) // => 2
//  * ["P1", "M2", "M3", "P4", "P5", "M6", "M7"].map(ic) // => [0, 2, 4, 5, 5, 3, 1]
//  */
// const isString = str => typeof str === 'string';
// const isNumber = str => typeof str === 'number';
// export const ic = (ivl?: IntervalName | IntervalStep | null) => {
//     let ivlClass = ivl;
//     if (isString(ivl)) ivlClass = getIntervalProps(ivl.toString()).chroma;
//     return either(CLASSES[mod12(ivlClass)], null, isNumber(ivlClass));
// };

// /**
//  * Given a interval property object, get the interval name
//  *
//  * The properties must contain a `num` *or* `step`, and `alt`:
//  *
//  * - num: the interval number
//  * - step: the interval step (overrides the num property)
//  * - alt: the interval alteration
//  * - oct: (Optional) the number of octaves
//  * - dir: (Optional) the direction
//  *
//  * @function
//  * @param {Object} props - the interval property object
//  *
//  * @return {String} the interval name
//  * @example
//  * Interval.build({ step: 1, alt: -1, oct: 0, dir: 1 }) // => "1d"
//  * Interval.build({ num: 9, alt: -1 }) // => "9m"
//  */
// export const build = (
//     { num, step, alt, oct = 1, dir } = {} as Partial<IntervalProps>
// ) => {
//     if (step !== undefined) num = step + 1 + 7 * oct;
//     if (num === undefined) return null;
//     if (typeof alt !== 'number') return null;
//     const d = typeof dir !== 'number' ? '' : dir < 0 ? '-' : '';
//     // const d = dir < 0 ? "-" : "";
//     const type = TYPES[numToStep(num)];
//     return (d + num + altToQ(type, alt)) as IntervalName;
// };

// /**
//  * Get the simplified version of an interval.
//  *
//  * @function
//  * @param {String} interval - the interval to simplify
//  * @return {String} the simplified interval
//  *
//  * @example
//  * Interval.simplify("9M") // => "2M"
//  * ["8P", "9M", "10M", "11P", "12P", "13M", "14M", "15P"].map(Interval.simplify)
//  * // => [ "8P", "2M", "3M", "4P", "5P", "6M", "7M", "8P" ]
//  * Interval.simplify("2M") // => "2M"
//  * Interval.simplify("-2M") // => "7m"
//  */
// export const simplify = (str: IntervalName) => {
//     const p = getIntervalProps(str);
//     if (p === NO_INTERVAL) return null;
//     const { simple, q } = p as Partial<IntervalProps>;

//     return simple + q;
// };

// /**
//  * Get the inversion (https://en.wikipedia.org/wiki/Inversion_(music)#Intervals)
//  * of an interval.
//  *
//  * @function
//  * @param {String} interval - the interval to invert in interval shorthand
//  * notation or interval array notation
//  * @return {String} the inverted interval
//  *
//  * @example
//  * Interval.invert("3m") // => "6M"
//  * Interval.invert("2M") // => "7m"
//  */
// const mod7 = n => n % 7;
// export const invert = (str: IntervalName) => {
//     const p = getIntervalProps(str);
//     if (p === NO_INTERVAL) return null;
//     const ivlProps = p as IntervalProps;
//     const { step, type, alt, dir, oct } = ivlProps;
//     const invStep = mod7(7 - step);
//     const invAlt = either(-alt, -(alt + 1), type === 'P');
//     return build({ step: invStep, alt: invAlt, oct, dir });
// };

// // interval numbers
// const IN = [1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7, 7];
// // interval qualities
// const IQ = 'P m M m M P d P m M m M'.split(' ');

// /**
//  * Get interval name from semitones number. Since there are several interval
//  * names for the same number, the name it"s arbitraty, but deterministic.
//  *
//  * @function
//  * @param {Integer} num - the number of semitones (can be negative)
//  * @return {String} the interval name
//  * @example
//  * import { fromSemitones } from "tonal-interval"
//  * fromSemitones(7) // => "5P"
//  * // or using tonal
//  * Tonal.Distance.fromSemitones(6) // => "-5P"
//  */
// const mod12 = n => n % 12;
// const div12 = n => Math.floor(n / 12);

// export const fromSemitones = (semitones: number): string => {
//     const [direction, distance] = [either(-1, 1, semitones < 0), Math.abs(semitones)];
//     const [chroma, octave] = [mod12(distance), div12(distance)];
//     return direction * (IN[chroma] + 7 * octave) + IQ[chroma];
// };

