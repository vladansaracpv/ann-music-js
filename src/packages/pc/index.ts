import { chroma as notechr } from '../note';
import { chroma as ivlchr } from '../interval';
// import { rotate, range, compact, isArray, eq, gt, land, neq, either } from '../helpers';
import { isArray, isNumber } from '../../base/types';

const chr = (str: string) => ivlchr(str) || notechr(str) || 0;
const pcsetNum = set => parseInt(chr(set), 2);
const clen = chroma => chroma.replace(/0/g, '').length;
const IVLS = '1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M'.split(' ');

const REGEX = /^[01]{12}$/;

export const isChroma = (set: string) => REGEX.test(set);

/**
 * Get chroma of a pitch class set. A chroma identifies each set uniquely.
 * It"s a 12-digit binary each presenting one semitone of the octave.
 *
 * Note that this function accepts a chroma as parameter and return it
 * without modification.
 *
 * @param {Array|String} set - the pitch class set
 * @return {String} a binary representation of the pitch class set
 * @example
 * PcSet.chroma(["C", "D", "E"]) // => "101010000000"
 */
export const chroma = set => {
  if (isChroma(set)) return set;
  if (!isArray(set)) return '';
  let b = Array(12).fill(0);
  set.map(chr).forEach(i => (b[i] = 1));
  return b.join('');
};

// let all = null;
// export const chromas = n => {
//   all = all || range(2048, 4095).map(n => n.toString(2));
//   return isNumber(n) ? all.filter(chroma => clen(chroma) === n) : all.slice();
// };

// /**
//  * Given a a list of notes or a pcset chroma, produce the rotations
//  * of the chroma discarding the ones that starts with "0"
//  *
//  * This is used, for example, to get all the modes of a scale.
//  *
//  * @param {Array|String} set - the list of notes or pitchChr of the set
//  * @param {Boolean} normalize - (Optional, true by default) remove all
//  * the rotations that starts with "0"
//  * @return {Array<String>} an array with all the modes of the chroma
//  *
//  * @example
//  * PcSet.modes(["C", "D", "E"]).map(PcSet.intervals)
//  */
// export const modes = (set, normalize = true) => {
//   normalize = normalize !== false;
//   const binary = chroma(set).split('');
//   return compact(
//     binary.map((val, i) => {
//       let r = rotate(i, binary);
//       return either(null, r.join(''), land(normalize, eq(r[0], '0')))
//     })
//   );
// };

// /**
//  * Given a pcset (notes or chroma) return it"s intervals
//  * @param {String|Array} pcset - the pitch class set (notes or chroma)
//  * @return {Array} intervals or empty array if not valid pcset
//  * @example
//  * PcSet.intervals("1010100000000") => ["1P", "2M", "3M"]
//  */
// export const intervals = set => {
//   if (!isChroma(set)) return [];
//   return compact(set.split('').map((d, i) => (d === '1' ? IVLS[i] : null)));
// };

// /**
//  * Test if two pitch class sets are identical
//  *
//  * @param {Array|String} set1 - one of the pitch class sets
//  * @param {Array|String} set2 - the other pitch class set
//  * @return {Boolean} true if they are equal
//  * @example
//  * PcSet.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
//  */
// export const isEqual = (...args) => {
//   if (eq(args.length, 1)) return s => isEqual(args[0], s);
//   return eq(chroma(args[0]), chroma(args[1]));
// };

// /**
//  * Create a function that test if a collection of notes is a
//  * subset of a given set
//  *
//  * The function can be partially applied
//  *
//  * @param {Array|String} set - an array of notes or a chroma set string to test against
//  * @param {Array|String} notes - an array of notes or a chroma set
//  * @return {boolean} true if notes is a subset of set, false otherwise
//  * @example
//  * const inCMajor = PcSet.isSubsetOf(["C", "E", "G"])
//  * inCMajor(["e6", "c4"]) // => true
//  * inCMajor(["e6", "c4", "d3"]) // => false
//  */
// export const isSubsetOf = (...args) => {
//   if (gt(1, args.length)) return isSubsetOf(args[0])(args[1]);
//   const set = pcsetNum(args[0]);
//   return notes => {
//     notes = pcsetNum(notes);
//     return land(neq(notes, set), eq((notes & set), notes));
//   };
// };

// /**
//  * Create a function that test if a collectio of notes is a
//  * superset of a given set (it contains all notes and at least one more)
//  *
//  * @param {Array|String} set - an array of notes or a chroma set string to test against
//  * @param {Array|String} notes - an array of notes or a chroma set
//  * @return {boolean} true if notes is a superset of set, false otherwise
//  * @example
//  * const extendsCMajor = PcSet.isSupersetOf(["C", "E", "G"])
//  * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
//  * extendsCMajor(["c6", "e4", "g3"]) // => false
//  */
// export const isSupersetOf = (...args) => {
//   if (gt(1, args.length)) return isSupersetOf(args[0])(args[1]);
//   const set = pcsetNum(args[0]);
//   return notes => {
//     notes = pcsetNum(notes);
//     return land(neq(notes, set), eq((notes | set), notes));
//   };
// };

// /**
//  * Test if a given pitch class set includes a note
//  * @param {Array|String} set - the base set to test against
//  * @param {String|Pitch} note - the note to test
//  * @return {Boolean} true if the note is included in the pcset
//  * @example
//  * PcSet.includes(["C", "D", "E"], "C4") // => true
//  * PcSet.includes(["C", "D", "E"], "C#4") // => false
//  */
// export const includes = (...args) => {
//   if (gt(1, args.length)) return includes(args[0])(args[1]);
//   const set = chroma(args[0]);
//   return note => eq(set[chr(note)], '1');
// };

// /**
//  * Filter a list with a pitch class set
//  *
//  * @param {Array|String} set - the pitch class set notes
//  * @param {Array|String} notes - the note list to be filtered
//  * @return {Array} the filtered notes
//  *
//  * @example
//  * PcSet.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
//  * PcSet.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
//  */
// export const filter = (...args) => {
//   if (eq(args.length, 1)) return n => filter(args[0], n);
//   return args[1].filter(includes(args[0]));
// };
