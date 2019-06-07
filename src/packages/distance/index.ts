import { Note as noteProps } from '../note/factories';
import { Interval as iprops } from '../interval/factories';
import { build as ibuild } from '../interval/properties';

// Map from letter step to number of fifths starting from "C":
// { C: 0, D: 2, E: 4, F: -1, G: 1, A: 3, B: 5 }
const FIFTHS = [0, 2, 4, -1, 1, 3, 5];

// Given a number of fifths, return the octaves they span
const fifthsOctaves = f => Math.floor((f * 7) / 12);

// Get the number of octaves it span each step
// [C, D, E,  F, G, A, B]
// [0, 1, 2, -1, 0, 1, 2]
export const FIFTH_OCTS = FIFTHS.map(fifthsOctaves);

/**
 * encode('2M') = [2, -1]
 *  2: number of fifths we added = 2*7 = 14 semitones
 * -1: how much octaves we need to substract to get initial tone = 14-1*12 = 2
 * @param param0
 */
export const encode = ({ step, alteration, octave, direction = 1 }) => {
  const f = FIFTHS[step] + 7 * alteration;
  if (octave === null) return [direction * f];
  const o = octave - FIFTH_OCTS[step] - 4 * alteration;
  return [direction * f, direction * o];
};

// We need to get the steps from fifths
// Fifths for CDEFGAB are [ 0, 2, 4, -1, 1, 3, 5 ]
// We add 1 to fifths to avoid negative numbers, so:
// for ["F", "C", "G", "D", "A", "E", "B"] we have:
// C-D-E-F-G-A-B
// 0-1-2-3-4-5-6
const STEPS = [3, 0, 4, 1, 5, 2, 6];

// Return the number of fifths as if it were unaltered
const unaltered = f => {
  const i = (f + 1) % 7;
  return i < 0 ? 7 + i : i;
};

const decode = (f, o = undefined, dir) => {
  const step = STEPS[unaltered(f)];
  const alt = Math.floor((f + 1) / 7);
  if (o === undefined) return { step, alt, dir };
  const oct = o + 4 * alt + FIFTH_OCTS[step];
  return { step, alteration: alt, octave: oct, direction: dir, num: 0 };
};

const memo = (fn, cache = {}) => str => cache[str] || (cache[str] = fn(str));

const encoder = props =>
  memo(str => {
    const p = props(str);
    return p.name === null ? null : encode(p);
  });

export const encodeNote = encoder(noteProps);
export const encodeIvl = encoder(iprops);

/**
 * Transpose a note by an interval. The note can be a pitch class.
 *
 * This function can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranpose } from "tonal-distance"
 * transpose("d3", "3M") // => "F#3"
 * // it works with pitch classes
 * transpose("D", "3M") // => "F#"
 * // can be partially applied
 * ["C", "D", "E", "F", "G"].map(transpose("M3)) // => ["E", "F#", "G#", "A", "B"]
 */
export const transpose = (...args) => {
  if (args.length === 1) return i => transpose(args[0], i);
  const n = encodeIvl(args[0]) !== null ? encodeIvl(args[0]) : encodeNote(args[0]);
  const i = encodeIvl(args[1]);
  if (n === null || i === null) return null;
  const tr = n.length === 1 ? [n[0] + i[0]] : [n[0] + i[0], n[1] + i[1]];
  console.log(tr);
  // return fromNote(decode(tr[0], tr[1], 1));
  return decode(tr[0], tr[1], 1);
};

/**
 * Transpose a pitch class by a number of perfect fifths.
 *
 * It can be partially applied.
 *
 * @function
 * @param {String} pitchClass - the pitch class
 * @param {Integer} fifhts - the number of fifths
 * @return {String} the transposed pitch class
 *
 * @example
 * import { trFifths } from "tonal-transpose"
 * [0, 1, 2, 3, 4].map(trFifths("C")) // => ["C", "G", "D", "A", "E"]
 * // or using tonal
 * Distance.trFifths("G4", 1) // => "D"
 */
export const trFifths = (...args) => {
  if (args.length === 1) return f => trFifths(args[0], f);
  const n = encodeNote(args[0]);
  if (n === null) return null;
  // return fromNote(decode(n[0] + args[1], 4, 1));
  return decode(n[0] + args[1], 4, 1);
};

/**
 * Get the distance in fifths between pitch classes
 *
 * Can be partially applied.
 *
 * @param {String} to - note or pitch class
 * @param {String} from - note or pitch class
 */
export const fifths = (...args) => {
  if (args.length === 1) return to => fifths(args[0], to);
  const f = encodeNote(args[0]);
  const t = encodeNote(args[1]);
  if (t === null || f === null) return null;
  return t[0] - f[0];
};

/**
 * The same as transpose with the arguments inverted.
 *
 * Can be partially applied.
 *
 * @param {String} note
 * @param {String} interval
 * @return {String} the transposed note
 * @example
 * import { tranposeBy } from "tonal-distance"
 * transposeBy("3m", "5P") // => "7m"
 */
export const transposeBy = (...args) => {
  if (args.length === 1) return n => transpose(n, args[0]);
  return transpose(args[0], args[1]);
};

const isDescending = e => e[0] * 7 + e[1] * 12 < 0;
const decodeIvl = i => (isDescending(i) ? decode(-i[0], -i[1], -1) : decode(i[0], i[1], 1));

export const addIntervals = (ivl1, ivl2, dir) => {
  const i1 = encodeIvl(ivl1);
  const i2 = encodeIvl(ivl2);
  if (i1 === null || i2 === null) return null;
  const i = [i1[0] + dir * i2[0], i1[1] + dir * i2[1]];
  return ibuild(decodeIvl(i));
};

/**
 * Add two intervals
 *
 * Can be partially applied.
 *
 * @param {String} interval1
 * @param {String} interval2
 * @return {String} the resulting interval
 * @example
 * import { add } from "tonal-distance"
 * add("3m", "5P") // => "7m"
 */
export const add = (...args) => {
  if (args.length === 1) return i2 => add(args[0], i2);
  return addIntervals(args[0], args[1], 1);
};

/**
 * Subtract two intervals
 *
 * Can be partially applied
 *
 * @param {String} minuend
 * @param {String} subtrahend
 * @return {String} interval diference
 */
export const subtract = (...args) => {
  if (args.length === 1) return i2 => add(args[0], i2);
  return addIntervals(args[0], args[1], -1);
};

/**
 * Find the interval between two pitches. It works with pitch classes
 * (both must be pitch classes and the interval is always ascending)
 *
 * Can be partially applied
 *
 * @param {String} from - distance from
 * @param {String} to - distance to
 * @return {String} the interval distance
 *
 * @example
 * import { interval } from "tonal-distance"
 * interval("C2", "C3") // => "P8"
 * interval("G", "B") // => "M3"
 *
 * @example
 * import * as Distance from "tonal-distance"
 * Distance.interval("M2", "P5") // => "P4"
 */
export const interval = (...args) => {
  if (args.length === 1) return t => interval(args[0], t);
  const f = encodeNote(args[0]);
  const t = encodeNote(args[1]);
  if (f === null || t === null || f.length !== t.length) return null;
  const d = f.length === 1 ? [t[0] - f[0], -Math.floor(((t[0] - f[0]) * 7) / 12)] : [t[0] - f[0], t[1] - f[1]];
  return ibuild(decodeIvl(d));
};

/**
 * Get the distance between two notes in semitones
 *
 * @param {String|Pitch} from - first note
 * @param {String|Pitch} to - last note
 * @return {Integer} the distance in semitones or null if not valid notes
 * @example
 * import { semitones } from "tonal-distance"
 * semitones("C3", "A2") // => -3
 * // or use tonal
 * Tonal.Distance.semitones("C3", "G3") // => 7
 */
export const semitones = (...args) => {
  if (args.length === 1) return t => semitones(args[0], t);
  const f = noteProps.fromName(args[0]);
  const t = noteProps.fromName(args[1]);
  return f.midi !== null && t.midi !== null
    ? t.midi - f.midi
    : f.chroma !== null && t.chroma !== null
    ? (t.chroma - f.chroma + 12) % 12
    : null;
};
