import { Note } from '@packages/note';
import { Interval } from '@packages/interval';
import { CustomError } from '@base/error';

import { range, compact, rotate, toBinary, isArray, isNumber, inSegment, either, and2 as both } from '../../base/index';
import { curry } from '@base/functional';

const PcError = CustomError('PC');
const IVLS = Interval && Interval.Theory.INTERVAL_NAMES;

export const EmptySet: PcProps = {
  empty: true,
  num: 0,
  chroma: '000000000000',
  normalized: '000000000000',
  length: 0,
};

/**
 *  Valid PcChroma is binary string of length = 12
 */
const PC_SET_REGEX = /^[01]{12}$/;

const cache: { [key in string]: PcProps } = {};

/**
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                 PC PROPS - VALIDATORS                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

export const PcValidator = {
  isPcsetNum: (set: any): set is PcNum => isNumber(set) && inSegment(0, 4095, set),
  isChroma: (set: any): set is PcChroma => PC_SET_REGEX.test(set),
  isPcset: (set: any): set is PcProps => set && this.isChroma(set.chroma),
};

/**
 * Rotates chroma string so that it starts with 1
 * @param {PcChroma} chroma
 * @returns {string}
 */
const normalize = (chroma: PcChroma): PcChroma => {
  const first = chroma.indexOf('1');
  return chroma.slice(first, 12) + chroma.slice(0, first);
};

/**
 * Calculate PcChroma set from given PcChroma string
 * @param {PcChroma} chroma
 * @returns {PcProps}
 */
function properties(chroma: PcChroma): PcProps {
  const num = parseInt(chroma, 2);
  const normalized = normalize(chroma);

  const pcs = chroma.split('');
  let length = 0;
  for (let i = 0; i < 12; i++) {
    // tslint:disable-next-line: curly
    if (chroma.charAt(i) === '1') length++;
  }
  const empty = length == 0;
  return { empty, num, chroma, normalized, length };
}

/**
 * Converts Note/Inverval array to PcChroma string
 * @param {Array<NoteName>|Array<IvlName>} set
 * @returns {PcChroma}
 */
export function toChroma(set: NoteName[] | IvlName[]): PcChroma {
  if (set.length === 0) {
    return EmptySet.chroma;
  }

  let pitch: NoNote | NoteProps | IvlProps | null;
  const binary = Array(12).fill(0);
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < set.length; i++) {
    pitch = Note && (Note.from({ name: set[i] }) as NoteProps);
    // tslint:disable-next-line: curly
    if (!(pitch && pitch.valid)) pitch = Interval.from({ name: set[i] }) as IvlProps;
    // tslint:disable-next-line: curly
    if (!pitch.valid) return EmptySet.chroma;
    if (pitch.valid) binary[pitch.chroma] = 1;
  }
  return binary.join('');
}

/**
 * Calculate PcProps from given PcSet
 * @param {PcSet} src
 * @returns {PcProps}
 */
export const pcset = function(src: PcSet): PcProps {
  const chroma: PcChroma = PcValidator.isChroma(src)
    ? src
    : PcValidator.isPcsetNum(src)
    ? Number(src)
        .toString(2)
        .padStart(12, '0')
    : isArray(src)
    ? toChroma(src)
    : PcValidator.isPcset(src)
    ? src.chroma
    : EmptySet.chroma;

  return (cache[chroma] = cache[chroma] || properties(chroma));
};

/**
 * Get PcProps value for given key
 * @param {string} key. keyof PcProps => {num, chroma, normalized, length}
 * @returns {string|number}
 */
export function pcsetProp(key: keyof PcProps) {
  return (src: PcSet) => {
    const s = pcset(src);
    return s ? s[key] : null;
  };
}

/**
 * Get the intervals of a pcset *starting from C*
 * @param {PcSet} src - the pitch class set
 * @returns {IntervalName[]} an array of interval names or an empty array if not a valid pitch class set
 */
export function intervals(src: PcSet): IvlName[] {
  const intervals: IvlName[] = [];
  const set = pcset(src);

  // PcChroma to array
  const chroma = set.chroma.split('');
  // Map every c == '1' to Interval at position i, then filter existing values
  return compact(chroma.map((c, i) => (c == '1' ? IVLS[i] : null)));
}

/**
 * Get a list of all possible pitch class sets (all possible chromas) *having C as root*.
 * There are 2048 different chromas.
 * If len is provided it filters to those PcChromas of length == len
 *
 * @see http://allthescales.org/
 * @param {number} len
 * @returns {Array<PcChroma>} an array of possible chromas from '10000000000' to '11111111111'
 */
export function chromaList(len?: number): PcChroma[] {
  let all: PcChroma[] = range(2048, 4095).map(toBinary);
  return len == undefined ? all.slice() : all.filter(chroma => pcset(chroma).length === len);
}

/**
 * Given a a list of notes or a pcset chroma, produce the rotations
 * of the chroma discarding the ones that starts with "0" (normalize=true)
 *
 * This is used, for example, to get all the modes of a scale.
 *
 * @param {PcSet} set - the list of notes or pitchChr of the set
 * @param {boolean} normalize - (Optional, true by default) remove all
 * the rotations that starts with "0"
 * @returns {Array<string>} an array with all the modes of the chroma
 */
export function modes(set: PcSet, normalize?: boolean): PcChroma[] {
  const pcs = pcset(set);
  const binary = pcs.chroma.split('');

  normalize = normalize !== false;

  return compact(
    binary.map((b, i) => {
      // make rotation starting with i
      const r = rotate(i, binary);
      // if we want normalized array, then we accept only those starting with r[0] === '1'
      return normalize && r[0] === '0' ? null : r.join('');
    }),
  );
}

/**
 * Test if two pitch class sets are numentical
 *
 * @param {Array<PcSet>} one - one of the pitch class sets
 * @param {Array<PcSet>} other - the other pitch class set
 * @return {boolean} true if they are equal
 * @example
 * Pcset.isEqual(["c2", "d3"], ["c5", "d2"]) // => true
 */
export function isEqual(one: PcSet, other: PcSet) {
  const num = pcsetProp('num');
  return num(one) === num(other);
}

/**
 * Create a function that test if a collection of notes is a
 * subset of a given set
 *
 * The function is curryfied.
 *
 * @param {PcSet} set - the superset to test against (chroma or list of notes)
 * @return {boolean}
 */
function fnIsSubsetOf(set: PcSet, notes: PcSet) {
  const s = pcset(set).num;
  const o = pcset(notes).num;

  return s !== o && (o & s) === o;
}
export const isSubsetOf = curry(fnIsSubsetOf);

/**
 * Create a function that test if a collection of notes is a
 * superset of a given set (it contains all notes and at least one more)
 *
 * @param {PcSet} set - the subset to test against (chroma or list of notes)
 * @return {boolean}
 * @example
 * const extendsCMajor = Pcset.isSupersetOf(["C", "E", "G"])
 * extendsCMajor(["e6", "a", "c4", "g2"]) // => true
 * extendsCMajor(["c6", "e4", "g3"]) // => false
 */
function fnIsSupersetOf(set: PcSet, notes: PcSet) {
  const s = pcset(set).num;
  const o = pcset(notes).num;
  return s !== o && (o | s) === o;
}
export const isSupersetOf = curry(fnIsSupersetOf);

/**
 * Test if a given pitch class set includes a note
 *
 * @param {PcSet} set - the base set to test against
 * @param {NoteName} note - the note to test
 * @return {boolean} true if the note is included in the pcset
 *
 * Can be partially applied
 *
 * @example
 * const isNoteInCMajor = isNoteIncludedInSet(['C', 'E', 'G'])
 * isNoteInCMajor('C4') // => true
 * isNoteInCMajor('C#4') // => false
 */
function fnIsNoteIncludedInSet(set: PcSet, note: NoteName) {
  const s = pcset(set);
  const n = Note && Note.from({ name: note });
  return s && n.valid && s.chroma.charAt(n.chroma) === '1';
}

export const isNoteIncludedInSet = curry(fnIsNoteIncludedInSet);

/**
 * Filter a list with a pitch class set
 *
 * @param {PcSet} set - the pitch class set notes
 * @param {Array<NoteName>} notes - the note list to be filtered
 * @return {Array<NoteName>} the filtered notes
 *
 * @example
 * Pcset.filter(["C", "D", "E"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "d2", "c3", "d3" ])
 * Pcset.filter(["C2"], ["c2", "c#2", "d2", "c3", "c#3", "d3"]) // => [ "c2", "c3" ])
 */
function filterNotesFn(set: PcSet, notes: NoteName[]) {
  const isIncluded = isNoteIncludedInSet(set);
  return notes.filter(isIncluded);
}
export const filterNotes = curry(filterNotesFn);

/**
 *
 * @param {IvlName} i1
 * @param {IvlName} i2
 * @param {boolean} addition - to add or subtract
 * @returns sum or difference of 2 intervals
 */
export const add = (i1: IvlName, i2: IvlName, addition = true): IvlName => {
  const ivl1 = Interval.from({ name: i1 });
  const ivl2 = Interval.from({ name: i2 });

  const semitones = ivl1.semitones + ivl2.semitones * either(1, -1, addition);

  const interval = Interval.from({ semitones });

  return interval.valid ? interval.name : undefined;
};

/**
 * Add two intervals
 *
 * Can be partially applied.
 *
 * @param {IvlName} interval1
 * @param {IvlName} interval2
 * @return {IvlName} the resulting interval
 */
export const addIntervals = (...args: IvlName[]) => {
  if (args.length === 1) return (i2: IvlName) => add(args[0], i2);
  return add(args[0], args[1]);
};

/**
 * Subtract two intervals
 *
 * Can be partially applied
 *
 * @param {IvlName} minuend
 * @param {IvlName} subtrahend
 * @return {IvlName} interval diference
 */
export const subIntervals = (...args: IvlName[]) => {
  if (args.length === 1) return (i2: IvlName) => add(args[0], i2);
  return add(args[0], args[1], false);
};

/**
 * Get the distance between two notes in semitones
 *
 * @param {NoteName} from - first note
 * @param {NoteName} to - last note
 * @return {number} the distance in semitones or null if not valid notes
 */
export const semitones = (...args: NoteName[]) => {
  if (args.length === 1) return (t: NoteName) => semitones(args[0], t);

  const f = Note && Note.from({ name: args[0] });
  const t = Note && Note.from({ name: args[1] });

  return either(t.midi - f.midi, null, both(f.valid, t.valid));
};

/**
 * Transpose a note by an interval. The note can be a pitch class.
 *
 * This function can be partially applied.
 *
 * @param {NoteName} note
 * @param {IvlName} interval
 * @return {NoteName} the transposed note
 * @example
 * import { tranpose } from "tonal-distance"
 * transpose("d3", "3M") // => "F#3"
 * // it works with pitch classes
 * transpose("D", "3M") // => "F#"
 * // can be partially applied
 * ["C", "D", "E", "F", "G"].map(transpose("M3")) // => ["E", "F#", "G#", "A", "B"]
 */
export const transpose = (...args: string[]): any => {
  if (args.length === 1) {
    return (i: NoteName) => transpose(i, args[0]);
  }
  const [n, i] = args;
  const note = Note && Note.from({ name: n });
  const interval = Interval.from({ name: i });

  if (!both(note.valid, interval.valid)) return undefined;

  const amount = note.midi + interval.semitones;

  return Note && Note.from({ midi: amount }).name;
};
