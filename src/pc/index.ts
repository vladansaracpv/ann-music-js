import { chroma as notechr } from '../note/properties';
import { chroma as ivlchr } from '../interval/theory';
import { rotate, range, compact } from '../helpers';

const chr = str => notechr(str) || ivlchr(str) || 0;
const pcsetNum = set => parseInt(chroma(set), 2);
const clen = chroma => chroma.replace(/0/g, '').length;

const REGEX = /^[01]{12}$/;
/**
 * Test if the given string is a pitch class set chroma.
 * @param {String} chroma - the pitch class set chroma
 * @return {Boolean} true if its a valid pcset chroma
 * @example
 * PcSet.isChroma("101010101010") // => true
 * PcSet.isChroma("101001") // => false
 */
export const isChroma = set => REGEX.test(set);

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
  if (!Array.isArray(set)) return '';
  let b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  set.map(chr).forEach(i => (b[i] = 1));
  return b.join('');
};

let all = null;
/**
 * Get a list of all possible chromas (all possible scales)
 * More information: http://allthescales.org/
 * @return {Array} an array of possible chromas from '10000000000' to '11111111111'
 *
 */
export const chromas = n => {
  all = all || range(2048, 4095).map(n => n.toString(2));
  return typeof n === 'number'
    ? all.filter(chroma => clen(chroma) === n)
    : all.slice();
};

/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0"
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {Array|String} set - the list of notes or pitchChr of the set
 * @param {Boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @return {Array<String>} an array with all the modes of the chroma
 *
 * @example
 * PcSet.modes(["C", "D", "E"]).map(PcSet.intervals)
 */
export const modes = (set, normalize = true) => {
  normalize = normalize !== false;
  const binary = chroma(set).split('');
  return compact(
    binary.map((_, i) => {
      let r = rotate(i, binary);
      return normalize && r[0] === '0' ? null : r.join('');
    })
  );
};

const IVLS = '1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M'.split(' ');
/**
 * Given a pcset (notes or chroma) return it"s intervals
 * @param {String|Array} pcset - the pitch class set (notes or chroma)
 * @return {Array} intervals or empty array if not valid pcset
 * @example
 * PcSet.intervals("1010100000000") => ["1P", "2M", "3M"]
 */
export const intervals = set => {
  if (!isChroma(set)) return [];
  return compact(set.split('').map((d, i) => (d === '1' ? IVLS[i] : null)));
};

/**
 * Test if two pitch class sets are identical
 *
 * @param {Array|String} set1 - one of the pitch class sets
 * @param {Array|String} set2 - the other pitch class set
 * @return {Boolean} true if they are equal
 * @example
 * PcSet.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */
export const isEqual = (...args) => {
  if (args.length === 1) return s => isEqual(args[0], s);
  return chroma(args[0]) === chroma(args[1]);
};

/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function can be partially applied
 *
 * @param {Array|String} set - an array of notes or a chroma set string to test against
 * @param {Array|String} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a subset of set, false otherwise
 * @example
 * const inCMajor = PcSet.isSubsetOf(["C", "E", "G"])
 * inCMajor(["e6", "c4"]) // => true
 * inCMajor(["e6", "c4", "d3"]) // => false
 */
export const isSubsetOf = (...args) => {
  if (args.length > 1) return isSubsetOf(args[0])(args[1]);
  const set = pcsetNum(args[0]);
  return notes => {
    notes = pcsetNum(notes);
    return notes !== set && (notes & set) === notes;
  };
};

/**
 * Create a function that test if a collectio of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {Array|String} set - an array of notes or a chroma set string to test against
 * @param {Array|String} notes - an array of notes or a chroma set
 * @return {boolean} true if notes is a superset of set, false otherwise
 * @example
 * const extendsCMajor = PcSet.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */
export const isSupersetOf = (...args) => {
  if (args.length > 1) return isSupersetOf(args[0])(args[1]);
  const set = pcsetNum(args[0]);
  return notes => {
    notes = pcsetNum(notes);
    return notes !== set && (notes | set) === notes;
  };
};

/**
 * Test if a given pitch class set includes a note
 * @param {Array|String} set - the base set to test against
 * @param {String|Pitch} note - the note to test
 * @return {Boolean} true if the note is included in the pcset
 * @example
 * PcSet.includes(["C", "D", "E"], "C4") // => true
 * PcSet.includes(["C", "D", "E"], "C#4") // => false
 */
export const includes = (...args) => {
  if (args.length > 1) return includes(args[0])(args[1]);
  const set = chroma(args[0]);
  return note => set[chr(note)] === '1';
};

/**
 * Filter a list with a pitch class set
 *
 * @param {Array|String} set - the pitch class set notes
 * @param {Array|String} notes - the note list to be filtered
 * @return {Array} the filtered notes
 *
 * @example
 * PcSet.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * PcSet.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */
export const filter = (...args) => {
  if (args.length === 1) return n => filter(args[0], n);
  return args[1].filter(includes(args[0]));
};
